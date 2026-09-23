import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

export const runtime = "nodejs";

/*
====================================
SUPABASE SERVER CLIENT
====================================
*/

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const secretKey =
    process.env
      .SUPABASE_SECRET_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is missing in .env.local"
    );
  }

  if (!secretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY is missing in .env.local"
    );
  }

  return createClient(
    supabaseUrl,
    secretKey,
    {
      auth: {
        autoRefreshToken:
          false,

        persistSession:
          false,
      },
    }
  );
}

/*
====================================
GET ALL BANNERS
====================================
*/

export async function GET() {
  try {
    const supabaseAdmin =
      getSupabaseAdmin();

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from("banners")
        .select("*")
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        );

    if (error) {
      console.error(
        "Load banners database error:",
        error
      );

      return NextResponse.json(
        {
          success:
            false,

          error:
            "Failed to load banners: " +
            error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success:
          true,

        banners:
          data || [],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET banners error:",
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to load banners.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
====================================
ADD BANNER
====================================
*/

export async function POST(
  request: NextRequest
) {
  try {
    const supabaseAdmin =
      getSupabaseAdmin();

    /*
    ================================
    READ FORM
    ================================
    */

    const formData =
      await request.formData();

    const title =
      String(
        formData.get(
          "title"
        ) || ""
      ).trim();

    const subtitle =
      String(
        formData.get(
          "subtitle"
        ) || ""
      ).trim();

    const image =
      formData.get(
        "image"
      );

    /*
    ================================
    VALIDATION
    ================================
    */

    if (!title) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Banner title is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!subtitle) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Banner subtitle is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !image ||
      !(
        image instanceof
        File
      )
    ) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Banner image is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !image.type.startsWith(
        "image/"
      )
    ) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Please select a valid image.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      image.size >
      10 *
        1024 *
        1024
    ) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Image must be less than 10 MB.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    ================================
    CREATE SAFE FILE NAME
    ================================
    */

    const safeName =
      image.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "-"
      );

    const fileName =
      `banner-${Date.now()}-${safeName}`;

    /*
    ================================
    CONVERT IMAGE
    ================================
    */

    const arrayBuffer =
      await image.arrayBuffer();

    const buffer =
      Buffer.from(
        arrayBuffer
      );

    /*
    ================================
    UPLOAD IMAGE
    ================================
    */

    const {
      error:
        uploadError,
    } =
      await supabaseAdmin
        .storage
        .from(
          "banners"
        )
        .upload(
          fileName,
          buffer,
          {
            contentType:
              image.type,

            cacheControl:
              "3600",

            upsert:
              false,
          }
        );

    if (uploadError) {
      console.error(
        "Banner storage error:",
        uploadError
      );

      return NextResponse.json(
        {
          success:
            false,

          error:
            "Image upload failed: " +
            uploadError.message,
        },
        {
          status: 500,
        }
      );
    }

    /*
    ================================
    GET PUBLIC URL
    ================================
    */

    const {
      data:
        publicUrlData,
    } =
      supabaseAdmin
        .storage
        .from(
          "banners"
        )
        .getPublicUrl(
          fileName
        );

    const imageUrl =
      publicUrlData
        .publicUrl;

    /*
    ================================
    SAVE BANNER DATABASE
    ================================
    */

    const {
      data:
        banner,
      error:
        insertError,
    } =
      await supabaseAdmin
        .from(
          "banners"
        )
        .insert([
          {
            title,
            subtitle,
            image:
              imageUrl,
          },
        ])
        .select()
        .single();

    /*
    ================================
    DATABASE ERROR
    ================================
    */

    if (insertError) {
      console.error(
        "Banner insert error:",
        insertError
      );

      /*
      Delete uploaded file
      if database save fails
      */

      await supabaseAdmin
        .storage
        .from(
          "banners"
        )
        .remove([
          fileName,
        ]);

      return NextResponse.json(
        {
          success:
            false,

          error:
            "Banner save failed: " +
            insertError.message,
        },
        {
          status: 500,
        }
      );
    }

    /*
    ================================
    SUCCESS
    ================================
    */

    return NextResponse.json(
      {
        success:
          true,

        banner,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST banner error:",
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to add banner.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
====================================
EDIT BANNER
====================================
*/

export async function PATCH(
  request: NextRequest
) {
  try {
    const supabaseAdmin =
      getSupabaseAdmin();

    const body =
      await request.json();

    const id =
      String(
        body.id || ""
      ).trim();

    const title =
      String(
        body.title || ""
      ).trim();

    const subtitle =
      String(
        body.subtitle ||
          ""
      ).trim();

    /*
    ================================
    VALIDATION
    ================================
    */

    if (!id) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Banner ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!title) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Banner title is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!subtitle) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Banner subtitle is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    ================================
    UPDATE BANNER
    ================================
    */

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "banners"
        )
        .update({
          title,
          subtitle,
        })
        .eq(
          "id",
          id
        )
        .select()
        .single();

    if (error) {
      console.error(
        "Banner update error:",
        error
      );

      return NextResponse.json(
        {
          success:
            false,

          error:
            "Banner update failed: " +
            error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success:
          true,

        banner:
          data,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PATCH banner error:",
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to update banner.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
====================================
DELETE BANNER
====================================
*/

export async function DELETE(
  request: NextRequest
) {
  try {
    const supabaseAdmin =
      getSupabaseAdmin();

    const body =
      await request.json();

    const id =
      String(
        body.id || ""
      ).trim();

    if (!id) {
      return NextResponse.json(
        {
          success:
            false,

          error:
            "Banner ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    ================================
    FIND BANNER
    ================================
    */

    const {
      data:
        banner,
      error:
        findError,
    } =
      await supabaseAdmin
        .from(
          "banners"
        )
        .select(
          "id,image"
        )
        .eq(
          "id",
          id
        )
        .single();

    if (findError) {
      console.error(
        "Find banner error:",
        findError
      );

      return NextResponse.json(
        {
          success:
            false,

          error:
            "Banner not found: " +
            findError.message,
        },
        {
          status: 404,
        }
      );
    }

    /*
    ================================
    DELETE DATABASE ROW
    ================================
    */

    const {
      error:
        deleteError,
    } =
      await supabaseAdmin
        .from(
          "banners"
        )
        .delete()
        .eq(
          "id",
          id
        );

    if (deleteError) {
      console.error(
        "Delete banner error:",
        deleteError
      );

      return NextResponse.json(
        {
          success:
            false,

          error:
            "Banner delete failed: " +
            deleteError.message,
        },
        {
          status: 500,
        }
      );
    }

    /*
    ================================
    DELETE STORAGE IMAGE
    ================================
    */

    if (
      banner?.image
    ) {
      try {
        const marker =
          "/storage/v1/object/public/banners/";

        const index =
          banner.image.indexOf(
            marker
          );

        if (
          index !== -1
        ) {
          const filePath =
            decodeURIComponent(
              banner.image.substring(
                index +
                  marker.length
              )
            );

          const {
            error:
              storageDeleteError,
          } =
            await supabaseAdmin
              .storage
              .from(
                "banners"
              )
              .remove([
                filePath,
              ]);

          if (
            storageDeleteError
          ) {
            console.error(
              "Storage cleanup error:",
              storageDeleteError
            );
          }
        }
      } catch (
        storageError
      ) {
        console.error(
          "Banner storage cleanup error:",
          storageError
        );
      }
    }

    /*
    ================================
    SUCCESS
    ================================
    */

    return NextResponse.json(
      {
        success:
          true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "DELETE banner error:",
      error
    );

    return NextResponse.json(
      {
        success:
          false,

        error:
          error instanceof Error
            ? error.message
            : "Failed to delete banner.",
      },
      {
        status: 500,
      }
    );
  }
}
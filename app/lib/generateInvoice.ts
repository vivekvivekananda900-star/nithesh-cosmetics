import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInvoice(
  orderId: string,
  customer: {
    name: string;
    phone: string;
    address: string;
  },
  items: any[],
  total: number
) {

  const doc = new jsPDF();

  const logo = new Image();


  logo.onload = () => {


    doc.addImage(
      logo,
      "PNG",
      15,
      10,
      28,
      28
    );


    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);

    doc.text(
      "NITHESH COSMETICS",
      105,
      20,
      {
        align: "center",
      }
    );


    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);


    doc.text(
      "Premium Men's Grooming & Cosmetics",
      105,
      28,
      {
        align: "center",
      }
    );


    doc.text(
      "Naganool Road, Near VKR Hospital, Nagarkurnool",
      105,
      35,
      {
        align: "center",
      }
    );


    doc.text(
      "Phone : +91 9676578296",
      105,
      42,
      {
        align: "center",
      }
    );


    doc.line(
      14,
      48,
      196,
      48
    );



    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);


    doc.text(
      `Invoice No : ${orderId}`,
      14,
      58
    );


    doc.text(
      `Date : ${new Date().toLocaleDateString()}`,
      140,
      58
    );



    doc.text(
      "Customer Details",
      14,
      70
    );


    doc.setFont("helvetica", "normal");


    doc.text(
      `Name : ${customer.name}`,
      14,
      78
    );


    doc.text(
      `Phone : ${customer.phone}`,
      14,
      86
    );


    doc.text(
      `Address : ${customer.address}`,
      14,
      94
    );





    autoTable(doc, {

      startY: 104,


      head: [
        [
          "Product",
          "Qty",
          "MRP",
          "Discount",
          "Amount"
        ]
      ],



      body: items.map((item:any)=>{


        const quantity =
          item.quantity ?? 1;


        const mrp =
          item.mrp ?? item.price;


        const discount =
          item.discount ?? 0;


        const amount =
          item.price * quantity;



        return [

          item.name,

          String(quantity),

          `Rs. ${mrp}`,

          `Rs. ${discount}`,

          `Rs. ${amount}`

        ];


      }),



      theme: "grid",


      styles: {

        fontSize: 11,

        cellPadding: 4

      }

    });






    const finalY =
      (doc as any).lastAutoTable.finalY + 12;





    const totalMrp =
      items.reduce(

        (sum:number,item:any)=>

          sum +
          (item.mrp ?? item.price)
          *
          (item.quantity ?? 1),

        0

      );






    const totalDiscount =
      items.reduce(

        (sum:number,item:any)=>

          sum +
          (item.discount ?? 0)
          *
          (item.quantity ?? 1),

        0

      );







    doc.setFont(
      "helvetica",
      "bold"
    );


    doc.setFontSize(13);



    doc.text(
      `Total MRP : Rs. ${totalMrp}`,
      14,
      finalY
    );



    doc.text(
      `Discount : Rs. ${totalDiscount}`,
      14,
      finalY + 8
    );



    doc.setFontSize(15);


    doc.text(
      `Grand Total : Rs. ${total}`,
      14,
      finalY + 18
    );




    doc.setFontSize(12);



    doc.text(
      "Payment Method : Cash on Delivery",
      14,
      finalY + 30
    );



    doc.text(
      "Order Status : Pending",
      14,
      finalY + 38
    );



    doc.line(
      14,
      finalY + 46,
      196,
      finalY + 46
    );




    doc.text(
      "Thank you for shopping with Nithesh Cosmetics!",
      105,
      finalY + 58,
      {
        align:"center",
      }
    );



    doc.text(
      "Visit Again ❤️",
      105,
      finalY + 66,
      {
        align:"center",
      }
    );




    doc.save(
      `Invoice-${orderId}.pdf`
    );


  };





  logo.onerror = () => {


    console.log(
      "Logo not found"
    );


    doc.text(
      "NITHESH COSMETICS",
      20,
      20
    );


    doc.save(
      `Invoice-${orderId}.pdf`
    );


  };



  logo.src="/logo.png";


}
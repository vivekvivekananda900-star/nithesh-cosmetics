export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}


export const products: Product[] = [

  {
    id: "1",
    name: "Professional Hair Trimmer",
    price: 999,
    category: "Barber Items",
    image: "/products/trimmer.jpg",
    description:
      "Professional rechargeable hair trimmer for salon and personal use."
  },


  {
    id: "2",
    name: "Electric Shaving Machine",
    price: 1499,
    category: "Shaving",
    image: "/products/shaving-machine.jpg",
    description:
      "Smooth and comfortable electric shaving machine."
  },


  {
    id: "3",
    name: "Face Cream",
    price: 299,
    category: "Cosmetics",
    image: "/products/face-cream.jpg",
    description:
      "Premium face cream for daily skincare."
  },


  {
    id: "4",
    name: "Hair Oil",
    price: 199,
    category: "Hair Care",
    image: "/products/hair-oil.jpg",
    description:
      "Natural hair oil for healthy hair growth."
  },


  {
    id: "5",
    name: "Beard Trimmer",
    price: 799,
    category: "Barber Items",
    image: "/products/beard-trimmer.jpg",
    description:
      "High quality beard trimming machine."
  },


  {
    id: "6",
    name: "Beauty Kit",
    price: 599,
    category: "Cosmetics",
    image: "/products/beauty-kit.jpg",
    description:
      "Complete beauty care kit."
  }

];
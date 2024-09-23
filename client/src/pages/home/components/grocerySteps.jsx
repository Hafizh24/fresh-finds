import { GiFruitBowl } from "react-icons/gi";
import { MdDeliveryDining } from "react-icons/md";
import { TiHome } from "react-icons/ti";

const stepItem = [
    {
        title: 'Choose Products',
        desc: 'Grocery shop anywhere, anytime with the FreshFinds website',
        img: <GiFruitBowl className="text-white h-[2rem] w-[2rem] lg:h-[3.2rem] lg:w-[3.2rem]" />,
    },
    {
        title: 'Place Your Address',
        desc: 'Set your delivery location, you can have multiple addresses',
        img: <TiHome className="text-white h-[2rem] w-[2rem] lg:h-[3.2rem] lg:w-[3.2rem]" />,
    },
    {
        title: 'Payment & Delivery',
        desc: 'Complete payment and we will deliver with your desired service',
        img: <MdDeliveryDining className="text-white h-[2rem] w-[2rem] lg:h-[3.2rem] lg:w-[3.2rem]" />,

    },
];

export const GrocerySteps = () => {

    return (
        <>
            <section
                className="relative w-full h-full mt-[2rem] lg:mt-[3rem]"
            >
                <img src="https://gts-gordo.myshopify.com/cdn/shop/files/slide-01-min-2_2048x.jpg?v=1613742673" alt="" className="absolute h-full w-full object-cover -z-10 opacity-[0.3]" />
                <div className="absolute h-full w-full bg-[#00d9a2] -z-10 opacity-[0.12]"></div>
                <div className="mx-[16px] md:mx-[32px] lg:mx-[160px] gap-[1.4rem]">
                    {/* <div className="flex justify-center pt-[1.5rem] lg:pt-[2rem] text-[25px] lg:text-[28px] text-[#343538] font-semibold text-center">
                        Grocery Shopping in 3 Simple Steps
                    </div> */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[0.8rem] lg:gap-[2rem] py-[1.8rem] lg:py-[2.5rem] overflow-auto">
                        {stepItem.map((item, index) => (
                            <div key={index} className="col-span-1 flex gap-[1rem] md:gap-0 md:flex-col justify-center items-center rounded-2xl px-[1rem] lg:px-0 py-[1.2rem] md:py-[2rem] bg-gray-100 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-[0.45] shadow-sm">
                                <div className="rounded-full bg-[#00cf9a] p-[1rem] md:p-[1.2rem]">
                                    {item.img}
                                </div>
                                <div className="flex flex-col md:items-center md:mt-[0.8rem]">
                                    <h4 className="font-semibold text-[16px] lg:text-[18px] text-[#343538]">{item.title}</h4>
                                    <p className="md:text-center lg:px-[2rem] text-[13.5px] lg:text-[14px] text-gray-600 mt-[0.2rem] md:mt-[0.4rem]">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

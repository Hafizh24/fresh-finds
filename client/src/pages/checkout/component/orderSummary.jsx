/* eslint-disable react/prop-types */

export const OrderSummary = ({
  carts,
  products,
  convertToIDR,
  total,
  productImage,
}) => {
  // console.log(productImage);

  // const fetchApi = async () => {
  //   const response = await axios.get('/order-details');

  //   // console.log(response.data.result);
  //   setCarts(response.data.result);
  // };

  // useEffect(() => {
  //   fetchApi()
  //   }
  // }, [d]);

  return (
    <>
      <section className="rounded-xl bg-[#FFFFFF] py-5 px-7 shadow-sm">
        <h3 className="text-[20px] font-bold border-b border-[#dcdcdc] text-[#28302A] pb-[0.6rem]">
          Order Summary
        </h3>
        <div className="divide-y">
          {carts?.map((item) => {
            const product = products.find(
              (product) => product.ProductId === item.id,
            );

            const prodImage = productImage?.find(
              (prod) => prod?.ProductId === item.id,
            );

            return (
              <div key={product?.Product?.id} className="flex gap-4 py-3">
                <img
                  src={
                    prodImage?.image
                      ? prodImage.image
                      : 'https://www.pngkey.com/png/detail/233-2332677_ega-png.png'
                  }
                  alt={product?.Product?.name}
                  className="w-[6rem] object-cover rounded-lg"
                />
                <div className="flex flex-col w-[20rem]">
                  <span className="text-[14px] font-medium text-gray-800 line-clamp-2">
                    {product?.Product?.name}
                  </span>
                  <div className="flex gap-2 mt-[0.3rem]">
                    <span className="text-[14px] font-medium text-gray-600">
                        {convertToIDR(product?.Product?.price)}
                    </span>
                    {/* <span className="text-[14px] font-medium text-gray-600">x 3</span> */}
                  </div>
                  <span className="text-[13px] font-medium text-gray-600">
                    Qty: {item.quantity}
                  </span>
                </div>
                <div className="ml-auto">
                  <span className="text-[15px] font-semibold text-gray-700">
                    {convertToIDR(product?.Product?.price * item?.quantity)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-[#dcdcdc] flex justify-between w-full pt-[1rem]">
          <h4 className="font-medium text-gray-700">Subtotal</h4>
          <h4 className="font-semibold">{convertToIDR(total)}</h4>
        </div>
      </section>
    </>
  );
};

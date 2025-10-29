"use client";

import { useRef } from "react";
import Slider from "react-slick";

export default function SliderImage() {

    const sliderRef = useRef<Slider>(null);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        variableWidth: false, // Quan trọng: set false để full width
        centerMode: false,    // Quan trọng: set false để full width
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1, // trên mobile mỗi slide chỉ 1 item (2 hình vẫn nằm ngang)
                },
            },
        ],
    };

    let templateSelect = [
        {
            id: 1,
            templateName: "テンプレートA",
            radioName: "templateSelect",
            imgSrc1: "/img/tool5/rankA1.png",
            imgSrc2: "/img/tool5/rankA2.png",
            value: "templateA",
        },
        {
            id: 2,
            templateName: "テンプレートB",
            radioName: "templateSelect",
            imgSrc1: "/img/tool5/rankB1.png",
            imgSrc2: "/img/tool5/rankB2.png",
            value: "templateB",
        },
        {
            id: 3,
            templateName: "テンプレートC",
            radioName: "templateSelect",
            imgSrc1: "/img/tool5/rankC1.png",
            imgSrc2: "/img/tool5/rankC2.png",
            value: "templateC",
        },
        {
            id: 4,
            templateName: "テンプレートD",
            radioName: "templateSelect",
            imgSrc1: "/img/tool5/rankD1.png",
            imgSrc2: "/img/tool5/rankD2.png",
            value: "templateD",
        },
    ]
    return (
        <div className="relative w-full mx-2">
            <Slider ref={sliderRef} {...settings}>
                {templateSelect?.map((item, index) => (
                    <div className="px-1" key={item.id}>
                        <table className="mb-2">
                            <tr>
                                <td>
                                    <img
                                        src={item.imgSrc1}
                                        className="w-auto h-[200px] object-cover"
                                        alt=""
                                    />
                                </td>
                                <td>
                                    <img
                                        src={item.imgSrc2}
                                        className="w-auto h-[200px] object-cover"
                                        alt=""
                                    />
                                </td>
                            </tr>
                        </table>
                        <div className="flex justify-center items-center">
                            <input
                                id={`template-index-${item.id}`}
                                name={item.radioName}
                                type="radio"
                                checked={index === 0}
                            />
                            <label htmlFor={`template-index-${item.id}`}>{item.templateName}</label>
                        </div>
                    </div>
                ))}
            </Slider>

            <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
            >
                ◀
            </button>

            <button
                onClick={() => sliderRef.current?.slickNext()}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow"
            >
                ▶
            </button>
        </div>
    );
}

"use client"

import { Button } from '@/component/common/Button'
import { Card, CardContent, CardHeader } from '@/component/common/Card'
import RadioBox from '@/component/common/RadioBox'
import SelectBox from '@/component/common/SelectBox'
import SliderImage from '@/app/tools/05/components/SliderImage'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/common/Tabs'
import { TextBox } from '@/component/common/TextBox'
import React, { useEffect } from 'react'
import { useHeader } from '@/app/context/HeaderContext'

const page = () => {

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        arrows: true,
    };

    return (
        <>
            <Tabs defaultTab="tab1">
                <TabsList>
                    <TabsTrigger value="tab1">ランキング画像設定</TabsTrigger>
                    <TabsTrigger value="tab2">ランキング一覧</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">
                    <Card>
                        <CardHeader title='1.テンプレート選択' />
                        <CardContent>
                            <SliderImage />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader title='2.詳細設定' />
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-10">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                        ランキング画像のサイズ設定
                                    </h3>
                                    <TextBox
                                        label='PC用 横幅の調整'
                                        id=''
                                        name=''
                                        value={""}
                                        direction='horizontal'
                                        suffix={
                                            <SelectBox
                                                id="pc_width_unit"
                                                name='pc_width_unit'
                                                classNameParent='mb-0'
                                                options={[
                                                    { value: "pixel", label: "px" },
                                                    { value: "percent", label: "%" },
                                                ]}
                                                defaultValue="px"
                                            />
                                        }
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                        画像挿入位置
                                    </h3>
                                    <RadioBox.Group
                                        defaultValue="2"
                                        direction='vertical'
                                        onChange={(value) => console.log("Selected:", value)}
                                    >
                                        <RadioBox.Option value="1">説明文の前</RadioBox.Option>
                                        <RadioBox.Option value="2">説明文の後</RadioBox.Option>
                                    </RadioBox.Group>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 my-4"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-10">
                                <div>
                                    <TextBox
                                        label='スマホ用 横幅の調整'
                                        id=''
                                        name=''
                                        value={""}
                                        direction='horizontal'
                                        suffix={
                                            <SelectBox
                                                id="pc_width_unit"
                                                name='pc_width_unit'
                                                classNameParent='mb-0'
                                                options={[
                                                    { value: "pixel", label: "px" },
                                                    { value: "percent", label: "%" },
                                                ]}
                                                defaultValue="px"
                                            />
                                        }
                                    />
                                </div>
                                <div>
                                    <RadioBox.Group
                                        defaultValue="2"
                                        direction='vertical'
                                        onChange={(value) => console.log("Selected:", value)}
                                    >
                                        <RadioBox.Option value="1">説明文の前</RadioBox.Option>
                                        <RadioBox.Option value="2">説明文の後</RadioBox.Option>
                                    </RadioBox.Group>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className='flex justify-center'>
                        <Button
                            size='lg'
                            type='submit'
                        >
                            設定を保存
                        </Button>
                    </div>
                </TabsContent>
                <TabsContent value="tab2">


                </TabsContent>
            </Tabs>
        </>
    )
}

export default page

/**Huyen */

"use client"

import { Button } from '@/component/common/Button'
import { Card, CardContent, CardHeader } from '@/component/common/Card'
import SelectBox from '@/component/common/SelectBox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/component/common/Tabs'
import { TextBox } from '@/component/common/TextBox'

import { CheckBoxGroup } from '@/component/common/CheckBox'
import React, { useState } from 'react'

const templates = [
    {
        id: 1,
        name: "テンプレートA",
        imgs: ["/img/tool07/A_MINI.jpg", "/img/tool07/A_NOMAL.jpg"],
    },
    {
        id: 2,
        name: "テンプレートB",
        imgs: ["/img/tool07/B_MINI.jpg", "/img/tool07/B_NOMAL.jpg"],
    },
    {
        id: 3,
        name: "テンプレートC",
        imgs: ["/img/tool07/C_MINI.jpg", "/img/tool07/C_NOMAL.jpg"],
    },
    {
        id: 4,
        name: "テンプレートD",
        imgs: ["/img/tool07/D_MINI.jpg", "/img/tool07/D_NOMAL.jpg"],
    },
    {
        id: 5,
        name: "テンプレートE",
        imgs: ["/img/tool07/E_MINI.jpg", "/img/tool07/E_NOMAL.jpg"],
    },

];

const page = () => {

    const [imagePositionPc, setImagePositionPc] = useState<string[]>([""]); // Mặc định là k tich chon
    const [imagePositionSp, setImagePositionSp] = useState<string[]>([""]);

    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    return (
        <>
            <h1 className="text-2xl mb-4 font-bold text-gray-800">レビュー評価バナー自動掲載</h1>
            <Tabs defaultTab="tab1">

                <TabsContent value="tab1">
                    <Card>
                        <CardHeader title='1.テンプレート選択' />
                        <CardContent>
                            <div className="relative">
                                <div className="flex items-start gap-4 overflow-x-auto pb-4">
                                    {templates.map((template) => (
                                        <div
                                            key={template.id}
                                            className="flex-shrink-0 text-center w-auto"
                                        >
                                            <div
                                                className="flex items-start gap-2 cursor-pointer"
                                                onClick={() => setSelectedImages(template.imgs)}
                                            >
                                                {template.imgs.map((imgSrc, index) => (
                                                    <img
                                                        key={index}
                                                        src={imgSrc}
                                                        alt={`${template.name} part ${index + 1}`}
                                                        className="w-36 h-36 object-cover rounded-lg mb-2 border-2 border-transparent hover:border-primary"
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-sm font-medium text-gray-700">
                                                {template.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                    <Card>


                        <CardHeader title='2.詳細設定' />
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-10">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                        レビュ画像のサイズ設定
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
                                    <CheckBoxGroup
                                        name="pc_position"
                                        defaultValue={imagePositionPc}
                                        onChange={setImagePositionPc}
                                        direction='vertical'
                                    >
                                        <CheckBoxGroup.Option value="1">説明文の前</CheckBoxGroup.Option>
                                        <CheckBoxGroup.Option value="2">説明文の後</CheckBoxGroup.Option>
                                    </CheckBoxGroup>
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
                                    <CheckBoxGroup
                                        name="sp_position"
                                        defaultValue={imagePositionSp}
                                        onChange={setImagePositionSp}
                                        direction='vertical'
                                    >
                                        <CheckBoxGroup.Option value="1">説明文の前</CheckBoxGroup.Option>
                                        <CheckBoxGroup.Option value="2">説明文の後</CheckBoxGroup.Option>
                                    </CheckBoxGroup>
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

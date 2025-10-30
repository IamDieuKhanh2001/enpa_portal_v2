import { Button } from '@/component/common/Button'
import { Card, CardContent, CardHeader } from '@/component/common/Card'
import { Table } from '@/component/common/Table'
import { IconTrash } from '@tabler/icons-react'
import React from 'react'

interface TabItem5Props {
    slideList: any[]
    setSlideList: React.Dispatch<React.SetStateAction<any[]>>
    addSlideRow: (numberRow?: number) => void
    deleteSlideRow: (id: number) => void
    tabsRef: React.RefObject<any>
}
const TabItem5 = ({ slideList, setSlideList, addSlideRow, deleteSlideRow, tabsRef }: TabItem5Props) => {

    const handleNextTab = () => {
        let currentTab = tabsRef.current?.getActiveTab();
        const currentIndexTab = Number(currentTab.match(/\d+/)?.[0] || 0);
        tabsRef.current?.setActiveTab(`tab${currentIndexTab + 1}`)
    }

    return (
        <>
            <Card>
                <CardHeader
                    title='5. スライドバナー設定'
                    buttonGroup={
                        <>
                            <Button
                                color='secondary'
                                size='sm'
                                onClick={() => addSlideRow(1)}
                            >
                                行を追加
                            </Button>
                            <Button
                                color='secondary'
                                size='sm'
                                onClick={() => addSlideRow(5)}
                            >
                                5行追加
                            </Button>
                        </>
                    }
                />
                <CardContent>
                    <Table.Container>
                        <Table.Head>
                            <Table.Row>
                                <Table.Th width='w-24'>ID</Table.Th>
                                <Table.Th width='w-24'>画像</Table.Th>
                                <Table.Th>画像URL</Table.Th>
                                <Table.Th>リンク先URL</Table.Th>
                                <Table.Th>削除</Table.Th>
                            </Table.Row>
                        </Table.Head>
                        <Table.Body>
                            {slideList?.map((item, index) => (
                                <Table.Row key={`slide-${index}`}>
                                    <Table.Td>{item.id}</Table.Td>
                                    <Table.ImageCell
                                        src={item.slideImg}
                                        alt='slide'
                                    />
                                    <Table.InputCell
                                        value={item.slideImg}
                                        onChange={(e) => {
                                            setSlideList((prevRows) =>
                                                prevRows.map((r) =>
                                                    r.id === item.id
                                                        ? { ...r, slideImg: e.target.value }
                                                        : r
                                                )
                                            )
                                        }}
                                    />
                                    <Table.InputCell
                                        value={item.url}
                                        onChange={(e) => {
                                            setSlideList((prevRows) =>
                                                prevRows.map((r) =>
                                                    r.id === item.id
                                                        ? { ...r, url: e.target.value }
                                                        : r
                                                )
                                            )
                                        }}
                                    />
                                    <Table.Button onClick={() => deleteSlideRow(item.id)}>
                                        <IconTrash size={20} />
                                    </Table.Button>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Container>
                </CardContent>
            </Card>
            <div className='flex items-center justify-end'>
                <Button
                    onClick={handleNextTab}
                    size='lg'
                    color='secondary'
                >
                    次へ
                </Button>
            </div>
        </>
    )
}

export default TabItem5

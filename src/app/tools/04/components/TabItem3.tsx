import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { Table } from '@/component/common/Table';
import { IconTrash } from '@tabler/icons-react';
import React from 'react';

interface TabItem3Props {
  addIconMenuRow: (id: number) => void;
  iconMenuList: any[];
  setIconMenuList: React.Dispatch<React.SetStateAction<any[]>>;
  deleteIconMenuRow: (id: number) => void;
}
const TabItem3 = ({
  addIconMenuRow,
  iconMenuList,
  setIconMenuList,
  deleteIconMenuRow,
}: TabItem3Props) => {
  return (
    <>
      <Card>
        <CardHeader title="参考" />
        <CardContent>
          <img src={'/img/tool4/tab3_des.jpg'} alt="" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          title="3.アイコン付きメニュー設定"
          buttonGroup={
            <>
              <Button color="secondary" size="sm" onClick={() => addIconMenuRow(1)}>
                行を追加
              </Button>
              <Button color="secondary" size="sm" onClick={() => addIconMenuRow(5)}>
                5行追加
              </Button>
            </>
          }
        />
        <CardContent>
          <Table.Container>
            <Table.Head>
              <Table.Row>
                <Table.Th width="w-24">ID</Table.Th>
                <Table.Th width="w-24">画像</Table.Th>
                <Table.Th>画像URL</Table.Th>
                <Table.Th>リンク先URL</Table.Th>
                <Table.Th>テキスト</Table.Th>
                <Table.Th>削除</Table.Th>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {iconMenuList?.map((item, index) => (
                <Table.Row key={`iconMenu-${index}`}>
                  <Table.Td>{item.id}</Table.Td>
                  <Table.ImageCell src={item.img} alt="iconMenu" />
                  <Table.InputCell
                    value={item.img}
                    onChange={(e) => {
                      setIconMenuList((prevRows) =>
                        prevRows.map((r) => (r.id === item.id ? { ...r, img: e.target.value } : r)),
                      );
                    }}
                  />
                  <Table.InputCell
                    value={item.url}
                    onChange={(e) => {
                      setIconMenuList((prevRows) =>
                        prevRows.map((r) => (r.id === item.id ? { ...r, url: e.target.value } : r)),
                      );
                    }}
                  />
                  <Table.InputCell
                    value={item.text}
                    onChange={(e) => {
                      setIconMenuList((prevRows) =>
                        prevRows.map((r) =>
                          r.id === item.id ? { ...r, text: e.target.value } : r,
                        ),
                      );
                    }}
                  />
                  <Table.Button onClick={() => deleteIconMenuRow(item.id)}>
                    <IconTrash size={20} />
                  </Table.Button>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Container>
        </CardContent>
      </Card>
    </>
  );
};

export default TabItem3;

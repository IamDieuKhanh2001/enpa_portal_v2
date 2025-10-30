'use client';
import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { Table } from '@/component/common/Table';
import { IconTrash } from '@tabler/icons-react';
import React from 'react';

interface TabItem2Props {
  addNavigationRow: (index: number) => void;
  deleteNavigationRow: (index: number) => void;
  navigationList: any[];
  setNavigationList: React.Dispatch<React.SetStateAction<any[]>>;
  tabsRef: React.RefObject<any>;
}
const TabItem2 = ({
  addNavigationRow,
  deleteNavigationRow,
  navigationList,
  setNavigationList,
  tabsRef,
}: TabItem2Props) => {
  const handleNextTab = () => {
    let currentTab = tabsRef.current?.getActiveTab();
    const currentIndexTab = Number(currentTab.match(/\d+/)?.[0] || 0);
    tabsRef.current?.setActiveTab(`tab${currentIndexTab + 1}`);
  };

  return (
    <>
      <Card>
        <CardHeader
          title="2. ナビゲーションメニュー設定"
          buttonGroup={
            <>
              <Button color="secondary" size="sm" onClick={() => addNavigationRow(1)}>
                行を追加
              </Button>
              <Button color="secondary" size="sm" onClick={() => addNavigationRow(5)}>
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
                <Table.Th>項目名</Table.Th>
                <Table.Th>リンク先URL</Table.Th>
                <Table.Th>削除</Table.Th>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {navigationList?.map((item, index) => (
                <Table.Row key={`navigation-${index}`}>
                  <Table.Td>{item.id}</Table.Td>
                  <Table.InputCell
                    value={item.name}
                    onChange={(e) => {
                      setNavigationList((prevRows) =>
                        prevRows.map((r) =>
                          r.id === item.id ? { ...r, name: e.target.value } : r,
                        ),
                      );
                    }}
                  />
                  <Table.InputCell
                    value={item.url}
                    onChange={(e) => {
                      setNavigationList((prevRows) =>
                        prevRows.map((r) => (r.id === item.id ? { ...r, url: e.target.value } : r)),
                      );
                    }}
                  />
                  <Table.Button onClick={() => deleteNavigationRow(item.id)}>
                    <IconTrash size={20} />
                  </Table.Button>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Container>
        </CardContent>
      </Card>
      <div className="flex items-center justify-end">
        <Button onClick={handleNextTab} size="lg" color="secondary">
          次へ
        </Button>
      </div>
    </>
  );
};

export default TabItem2;

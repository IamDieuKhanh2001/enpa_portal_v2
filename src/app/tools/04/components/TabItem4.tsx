import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import { Table } from '@/component/common/Table';
import { IconTrash } from '@tabler/icons-react';
import React from 'react';

interface TabItem4Props {
  suggestKeywordList: any[];
  setSuggestKeywordList: React.Dispatch<React.SetStateAction<any[]>>;
  addSuggestKeywordRow: (numberRow?: number) => void;
  deleteSuggestKeywordRow: (id: number) => void;
}
const TabItem4 = ({
  suggestKeywordList,
  setSuggestKeywordList,
  addSuggestKeywordRow,
  deleteSuggestKeywordRow,
}: TabItem4Props) => {
  return (
    <>
      <Card>
        <CardHeader title="参考" />
        <CardContent>
          <img src={'/img/tool4/tab4_des.jpg'} alt="" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          title="4. 注目キーワード設定"
          buttonGroup={
            <>
              <Button color="secondary" size="sm" onClick={() => addSuggestKeywordRow(1)}>
                行を追加
              </Button>
              <Button color="secondary" size="sm" onClick={() => addSuggestKeywordRow(5)}>
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
                <Table.Th>キーワード</Table.Th>
                <Table.Th>検索URL</Table.Th>
                <Table.Th>削除</Table.Th>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {suggestKeywordList?.map((item, index) => (
                <Table.Row key={`keyword-${index}`}>
                  <Table.Td>{item.id}</Table.Td>
                  <Table.InputCell
                    value={item.keyword}
                    onChange={(e) => {
                      setSuggestKeywordList((prevRows) =>
                        prevRows.map((r) =>
                          r.id === item.id ? { ...r, keyword: e.target.value } : r,
                        ),
                      );
                    }}
                  />
                  <Table.InputCell
                    value={item.url}
                    onChange={(e) => {
                      setSuggestKeywordList((prevRows) =>
                        prevRows.map((r) => (r.id === item.id ? { ...r, url: e.target.value } : r)),
                      );
                    }}
                  />
                  <Table.Button onClick={() => deleteSuggestKeywordRow(item.id)}>
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

export default TabItem4;

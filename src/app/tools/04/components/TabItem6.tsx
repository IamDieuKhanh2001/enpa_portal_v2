import { Button } from '@/component/common/Button';
import { Card, CardContent, CardHeader } from '@/component/common/Card';
import SelectBox from '@/component/common/SelectBox';
import { Table } from '@/component/common/Table';
import { TextBox } from '@/component/common/TextBox';
import { IconTrash } from '@tabler/icons-react';
import { FormikValues } from 'formik';
import React from 'react';

interface TabItem6Props {
  formik: FormikValues;
  showButtonSetting: boolean;
  setShowButtonSettting: React.Dispatch<React.SetStateAction<boolean>>;
  addFeatureRow: (numberRow?: number) => void;
  deleteFeatureRow: (id: number) => void;
  featureList: any[];
  setFeatureList: React.Dispatch<React.SetStateAction<any[]>>;
}
const TabItem6 = ({
  formik,
  showButtonSetting,
  setShowButtonSettting,
  addFeatureRow,
  deleteFeatureRow,
  featureList,
  setFeatureList,
}: TabItem6Props) => {
  return (
    <>
      <Card>
        <CardHeader title="参考" />
        <CardContent>
          <img src={'/img/tool4/tab6_des.jpg'} alt="" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="6. 特集設定" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-4">
            <TextBox
              id="featureTitle"
              name="featureTitle"
              type="text"
              width="full"
              label={'見出し'}
              value={formik.values.featureTitle}
              placeholder="例：新商品"
              direction="vertical"
              onChange={formik.handleChange}
              error={formik.errors.featureTitle}
              touched={formik.touched.featureTitle}
            />
            <SelectBox
              id=""
              name=""
              label="ボタン有無"
              width="full"
              direction="vertical"
              value={showButtonSetting ? '1' : '0'}
              options={[
                { value: '1', label: '有' },
                { value: '0', label: '無' },
              ]}
              onChange={(e) => {
                setShowButtonSettting(e.target.value === '1' ? true : false);
              }}
            />
            {showButtonSetting && (
              <React.Fragment>
                <div>
                  <TextBox
                    id="buttonText"
                    name="buttonText"
                    type="text"
                    width="full"
                    isRequired={true}
                    label={'ボタン文言'}
                    value={formik.values.buttonText}
                    placeholder="例：楽天に遷移する"
                    direction="vertical"
                    onChange={formik.handleChange}
                    error={formik.errors.buttonText}
                    touched={formik.touched.buttonText}
                  />
                </div>
                <div>
                  <TextBox
                    id="buttonLink"
                    name="buttonLink"
                    type="text"
                    width="full"
                    isRequired={true}
                    label={'ボタンリンク先'}
                    value={formik.values.buttonLink}
                    placeholder="例：https://www.rakuten.co.jp/"
                    direction="vertical"
                    onChange={formik.handleChange}
                    error={formik.errors.buttonLink}
                    touched={formik.touched.buttonLink}
                  />
                </div>
              </React.Fragment>
            )}
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-4">
            <SelectBox
              id=""
              name=""
              label="画像の横幅"
              width="full"
              direction="vertical"
              value={showButtonSetting ? '1' : '0'}
              options={[
                { value: '2', label: '2列用' },
                { value: '3', label: '3列用' },
                { value: '4', label: '4列用' },
                { value: '6', label: '6列用' },
              ]}
              onChange={(e) => {
                setShowButtonSettting(e.target.value === '1' ? true : false);
              }}
            />
          </div> */}
          <div className="flex justify-end gap-2 mb-2">
            <Button color="secondary" size="sm" onClick={() => addFeatureRow(1)}>
              行を追加
            </Button>
            <Button color="secondary" size="sm" onClick={() => addFeatureRow(5)}>
              5行追加
            </Button>
          </div>
          <Table.Container>
            <Table.Head>
              <Table.Row>
                <Table.Th width="w-24">ID</Table.Th>
                <Table.Th width="w-24">画像</Table.Th>
                <Table.Th>画像URL</Table.Th>
                <Table.Th>リンク先URL</Table.Th>
                <Table.Th>画像の横幅</Table.Th>
                <Table.Th>削除</Table.Th>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {featureList?.map((item, index) => (
                <Table.Row key={`feature-${index}`}>
                  <Table.Td>{item.id}</Table.Td>
                  <Table.ImageCell src={item.img} alt="slide" />
                  <Table.InputCell
                    value={item.img}
                    onChange={(e) => {
                      setFeatureList((prevRows) =>
                        prevRows.map((r) => (r.id === item.id ? { ...r, img: e.target.value } : r)),
                      );
                    }}
                  />
                  <Table.InputCell
                    value={item.url}
                    onChange={(e) => {
                      setFeatureList((prevRows) =>
                        prevRows.map((r) => (r.id === item.id ? { ...r, url: e.target.value } : r)),
                      );
                    }}
                  />
                  <Table.SelectBox
                    value={item.colWidth}
                    onChange={(e) => {
                      setFeatureList((prevRows) =>
                        prevRows.map((r) =>
                          r.id === item.id ? { ...r, colWidth: e.target.value } : r,
                        ),
                      );
                    }}
                  >
                    <Table.Option value={'2'}>2列用</Table.Option>
                    <Table.Option value={'3'}>3列用</Table.Option>
                    <Table.Option value={'4'}>4列用</Table.Option>
                    <Table.Option value={'6'}>6列用</Table.Option>
                  </Table.SelectBox>
                  <Table.Button onClick={() => deleteFeatureRow(item.id)}>
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

export default TabItem6;

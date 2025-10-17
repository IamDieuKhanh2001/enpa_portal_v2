'use client'

import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./component/Card";
import { Input } from "./component/Input";
import { Button } from "./component/Button";
import { Alert } from "./component/Alert";

export default function Home() {
  return (
    <>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800">セールページ作成</h1>
        <Card>
          <CardHeader>
            <CardTitle>カードタイトル</CardTitle>
            <CardDescription>カードdes</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              aaa
            </Alert>
            <Input
              id="custom-event-name"
              name="custom-event-name"
              form="formName"
              isRequired={true}
              label={"イベント名を入力"}
              value={"aaaa"}
              direction="horizontal"
              placeholder="カスタムイベント名"
              onChange={() => {

              }}
            />
            <Input
              id="custom-event-name"
              name="custom-event-name"
              form="formName"
              isRequired={false}
              label={"イベント名を入力"}
              value={"aaaa"}
              placeholder="カスタムイベント名"
              onChange={() => {

              }}
            />
            <Input
              id="custom-event-name"
              name="custom-event-name"
              form="formName"
              isRequired={false}
              label={"イベント名を入力"}
              value={"aaaa"}
              placeholder="カスタムイベント名"
              onChange={() => {

              }}
            />
          </CardContent>
          <CardFooter>
            <Button variant="danger">Button footer</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Component alert</CardTitle>
            <CardDescription>aaaa</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="info">
              thong bao info
            </Alert>
            <Alert variant="success">
              thong bao success
            </Alert>
            <Alert variant="error">
              thong bao error
            </Alert>
            <Alert variant="warning">
              thong bao warning
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Component Button</CardTitle>
            <CardDescription>mau nut button</CardDescription>
          </CardHeader>
          <CardContent>
            <Button style={{ background: "darkblue" }} variant="primary">primary</Button>
            <Button variant="secondary">secondary</Button>
            <Button variant="danger">danger</Button>
            <Button>sssss</Button>
          </CardContent>
        </Card>
      </div>

    </>
  );
}

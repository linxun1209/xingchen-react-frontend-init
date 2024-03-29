import { DEFAULT_AVATAR_URL, selectGender } from '@/constants';
import { getLoginUserUsingGet, updateMyUserUsingPost } from '@/services/backend/userController';
import {ModalForm, PageContainer, ProForm, ProFormText, ProFormUploadButton} from '@ant-design/pro-components';
import {ProFormItem, ProFormSelect} from '@ant-design/pro-form';
import { Button, Descriptions, Divider, Image, message } from 'antd';
import React, { useEffect, useState } from 'react';
import PictureUploader from "@/components/PictureUploader";

const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

const UserInfo: React.FC = () => {
    const [myUser, setMyUser] = useState({
        userName: '',
        userAccount: '',
        userAvatar: '',
        userRole: 'user',
        gender: '',
        phone: '',
        email: '',
        userStatus: '0',
        userCode: '',
        createTime: '',
        updateTime: '',
    });
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getLoginUserUsingGet(); // 使用 getLoginUserUsingGET 发送请求
                console.log(res.data)
                // @ts-ignore
                setMyUser(res.data);
            } catch (error) {
                // 处理请求错误
                message.error('请求参数错误！');
            }
        }



        fetchData();
    }, []);

    return (
        <>
          <PageContainer title={<></>}>
              <Divider style={{ fontWeight: 'bold', color: 'blue' }}>用户信息</Divider>
              <Descriptions
                bordered
                column={1}
                size={'middle'}
                contentStyle={{ fontWeight: 'bold', color: 'blue' }}
              >
                <Descriptions.Item style={{ textAlign: 'center' }} label="用户头像：">
                  <Image
                    src={myUser.userAvatar === null ? DEFAULT_AVATAR_URL : myUser.userAvatar}
                    width={30}
                    height={30}
                    style={{borderRadius:'50%'}}
                  />
                </Descriptions.Item>
                <Descriptions.Item style={{ textAlign: 'center' }} label="用户名：">
                  {myUser.userName}
                </Descriptions.Item>
                <Descriptions.Item style={{ textAlign: 'center' }} label="性别：">
                  {myUser.gender}
                </Descriptions.Item>
                <Descriptions.Item style={{ textAlign: 'center' }} label="用户账户：">
                  {myUser.userAccount}
                </Descriptions.Item>
                <Descriptions.Item style={{ textAlign: 'center' }} label="我的身份：">
                  {myUser.userRole === 'user' ? '普通用户' : '管理员'}
                </Descriptions.Item>
                <Descriptions.Item style={{ textAlign: 'center' }} label="我的编号：">
                  {myUser.userCode}
                </Descriptions.Item>
                <Descriptions.Item style={{ textAlign: 'center' }} label="手机号码：">
                  {myUser.phone === null ? '尚未填写手机号码！' : myUser.phone}
                </Descriptions.Item>
                <Descriptions.Item style={{ textAlign: 'center' }} label="我的邮箱：">
                  {myUser.email === null ? '尚未填写邮箱！' : myUser.email}
                </Descriptions.Item>
                <Descriptions.Item style={{ textAlign: 'center', color: '#1bf113' }} label="我的状态：">
                  {/*@ts-ignore*/}
                  {myUser.userStatus === 0 ? '正常在线' : '账号异常'}
                </Descriptions.Item>
                <Descriptions.Item style={{ textAlign: 'center' }} label="用户创建时间：">
                  {myUser.createTime}
                </Descriptions.Item>
                <Descriptions.Item style={{ textAlign: 'center' }} label="用户更新时间：">
                  {myUser.updateTime}
                </Descriptions.Item>
              </Descriptions>

              <ModalForm<API.UserUpdateMyRequest>
                title="修改我的信息"
                trigger={
                  <Button
                    type="primary"
                    shape="round"
                    style={{ marginTop: '25px', width: '250px', marginLeft: '650px' }}
                  >
                    修改我的信息
                  </Button>
                }
                autoFocusFirstInput
                modalProps={{
                  destroyOnClose: true,
                  onCancel: () => console.log('run'),
                }}
                submitTimeout={2000}
                onFinish={async (values) => {
                  await waitTime(1000);
                  //点击发起请求
                  const isModify = await updateMyUserUsingPost(values);
                  if (isModify) {
                    message.success('修改成功！');
                    // 刷新用户信息表单
                    location.reload();
                    return true;
                  }else {
                    message.error("修改失败！")
                  }
                  return false;
                }}
              >
                <ProForm.Group>
                  <ProFormText
                    width="md"
                    name="userName"
                    label="用户名"
                    placeholder="请输入用户名"
                    initialValue={myUser.userName}
                    rules={[
                      {
                        required: true,
                        message: '请输入选择用户名!',
                      },
                    ]}
                  />
                  <ProFormText
                    width="md"
                    name="userAccount"
                    label="账号名称"
                    placeholder="你想修改的账号名称"
                    initialValue={myUser.userAccount}
                    rules={[
                      {
                        required: true,
                        message: '请输入选择账号名称!',
                      },
                    ]}
                  />
                  <ProFormText
                    width="md"
                    name="phone"
                    label="修改手机号码"
                    placeholder="修改手机号码密码"
                    initialValue={myUser.phone}
                  />
                  <ProFormSelect
                    width="md"
                    name="gender"
                    label="修改性别"
                    placeholder="修改我的性别"
                    options={selectGender}
                    initialValue={myUser.gender}
                  />
                  <ProFormText
                    width="md"
                    name="email"
                    label="修改邮箱"
                    placeholder="修改修改后的邮箱"
                    initialValue={myUser.email}
                  />
                  <ProFormText
                    width="md"
                    name="userCode"
                    label="修改我的编码"
                    placeholder="输入修改后的编码"
                    initialValue={myUser.userCode}
                  />

                  <ProFormItem label="用户头像" name="picture">
                    <PictureUploader biz="user_avatar" />
                    <ProFormText
                      width="md"
                      name="userAvatar"
                      label="修改我的头像"
                      placeholder="输入修改后的头像"
                      initialValue={myUser.userAvatar}
                    />
                  </ProFormItem>
                </ProForm.Group>
              </ModalForm>
            </PageContainer>
        </>
    );
};

export default UserInfo;

import React from "react";
import { Button, Input, Form, message, Typography } from "antd";
import { useLogin } from "../service/useLogin";
import { useNavigate } from "react-router-dom";
import { ILogin } from "../service/useLogin";
import najot from "../assets/najot-talim.png";
import logo from "../assets/najot-logo.svg";
import { saveState } from "../config/store/storage";

export const LoginUser: React.FC = () => {
    const { mutate } = useLogin();
    const navigate = useNavigate();

    const onFinish = (data: ILogin) => {
        mutate(data, {
            onSuccess: (res) => {
                saveState("token", res.data);
                navigate("/app");
                message.success("muvaffaqiyatli kirdingiz!");
            },
        });
    };

    return (
        <div className="wrapper">
            <img className="najot-img" src={najot} alt="najot-img" />
            <div className="box-form">
                <img src={logo} alt="logo" />
                <Typography
                    style={{
                        fontSize: "32px",
                        fontWeight: 400,
                        marginBottom: "32px",
                        color: "black",
                        marginTop: "82px",
                    }}
                >
                    Tizimga kirish
                </Typography>
                <Form
                    name="basic"
                    onFinish={onFinish}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="Login"
                        name="login"
                        rules={[
                            {
                                message: "Iltimos, login kiriting!",
                            },
                        ]}
                    >
                        <Input
                            style={{ padding: "12px", width: "380px" }}
                            placeholder="Loginni kiriting"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                message: "Iltimos, parolni kiriting!",
                            },
                        ]}
                    >
                        <Input.Password
                            style={{ padding: "12px", width: "380px" }}
                            placeholder="Parolni kiriting"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            style={{
                                backgroundColor: "#0eb182",
                                paddingLeft: "173px",
                                paddingRight: "173px",
                            }}
                            type="primary"
                            htmlType="submit"
                            size="large"
                        >
                            Kirish
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

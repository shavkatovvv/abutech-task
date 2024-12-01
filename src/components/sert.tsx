import React, { useState } from "react";
import {
    Table,
    Button,
    Modal,
    Input,
    Form,
    Upload,
    message,
    Dropdown,
} from "antd";
import type { TableColumnsType } from "antd";
import {
    PaperClipOutlined,
    SearchOutlined,
    MoreOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { useGetSert } from "../service/useGetSert";
import { userCreateSert, Icontract } from "../service/useCreateSert";
import { useCreatFile, dataType } from "../service/useCreateFiles";
import { qClient } from "../config/client/client";
import { userEditSert } from "../service/useEditSert";
import { useSearchSert } from "../service/useSearchSert";
import { useDebounce } from "../config/debounce";

interface Contract {
    key: number;
    id: number;
    title: string;
    name: string;
}

interface formData {
    title?: string;
    courseId?: number;
}

export const SertTable: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const { data: sert } = useGetSert();
    const { mutate: createContract } = userCreateSert();
    const { mutate: createFile } = useCreatFile();
    const [form] = Form.useForm();
    const [cData, setCrData] = useState<dataType>();
    const { mutate: editContract } = userEditSert();
    const [fileList, setFileList] = useState<any[]>([]);
    const [searchInput, setSearchInput] = useState<string>("");
    const debounceValue = useDebounce(searchInput);
    const { data: searchSert } = useSearchSert(debounceValue);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setFileList([]);
        form.resetFields();
    };

    const handleOk = () => {
        form.submit();
    };

    const FileUpload = (file: any) => {
        const formData = new FormData();

        formData.append("files", file.file);

        createFile(formData, {
            onSuccess: (res: any) => {
                setCrData(res);

                message.success("File yuklandi!");
                file.onSuccess?.();
            },
            onError: (err: any) => {
                message.error("File yuklanmadi.");
                file.onError?.(err);
            },
        });
    };

    const onFinish = (values: formData) => {
        const contractData: Icontract = {
            title: values.title,
            courseId: 0,
            attachment: {
                url: cData?.data[0].path || "",
                origName: cData?.data[0].fileName || "",
                size: cData?.data[0].size || 0,
            },
        };

        if (isEditing && editingId !== null) {
            editContract(
                { id: editingId, data: contractData },
                {
                    onSuccess: () => {
                        message.success(
                            "Contract muvaffaqiyatli o'zgartirildi"
                        );
                        handleCancel();
                        qClient.invalidateQueries({ queryKey: ["contracts"] });
                    },
                    onError: () => {
                        message.error("Contract o'zgartirishda xatolik");
                    },
                }
            );
        } else {
            createContract(contractData, {
                onSuccess: () => {
                    message.success("Contract muvaffaqiyatli yaratildi");
                    handleCancel();
                    qClient.invalidateQueries({ queryKey: ["contracts"] });
                },
                onError: (error) => {
                    message.error("Contract yaratishda xatolik");
                    console.log(error);
                },
            });
        }
    };

    const Edit = (record: Contract) => {
        setIsEditing(true);
        setEditingId(record.id);
        showModal();
        form.setFieldsValue({
            title: record.title,
            courseId: 0,
        });
    };

    const menuItems = [
        {
            key: "edit",
            label: "Tahrirlash",
            icon: <EditOutlined />,
            onClick: Edit,
        },
    ];

    const columns: TableColumnsType<Contract> = [
        {
            title: "#",
            dataIndex: "key",
        },
        {
            title: "Nomi",
            dataIndex: "name",
        },
        {
            title: "Kurs",
            dataIndex: "title",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: (_: any, record: Contract) => (
                <Dropdown
                    menu={{
                        items: menuItems.map((item) => ({
                            ...item,
                            onClick: () => Edit(record),
                        })),
                    }}
                    trigger={["click"]}
                >
                    <Button
                        style={{ border: "2px solid #D9D9D9" }}
                        icon={<MoreOutlined />}
                    />
                </Dropdown>
            ),
        },
    ];

    const data = searchSert
        ? sert?.data.data?.contracts
              .filter((item: any) =>
                  item.title.toLowerCase().includes(searchInput.toLowerCase())
              )
              .map((item: any, index: number) => ({
                  key: index + 1,
                  id: item.id,
                  title: item.title,
                  name: item.attachment?.origName,
              })) || []
        : sert?.data.data?.contracts.map((item: any, index: number) => ({
              key: index + 1,
              id: item.id,
              title: item.title,
              name: item.attachment?.origName,
          })) || [];

    return (
        <div className="table-box">
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                }}
            >
                <Form>
                    <Form.Item name={"search"}>
                        <Input
                            onChange={(e) => setSearchInput(e.target.value)}
                            style={{
                                border: "none",
                                fontSize: "19px",
                                fontWeight: 400,
                                color: "#667085",
                                paddingLeft: "10px",
                            }}
                            placeholder="Qidiruv"
                            prefix={
                                <SearchOutlined style={{ color: "#667085" }} />
                            }
                        />
                    </Form.Item>
                </Form>
                <Button
                    style={{ backgroundColor: "#0eb182", textAlign: "right" }}
                    type="primary"
                    onClick={showModal}
                >
                    Qoshish
                </Button>
            </div>
            <Table<Contract>
                columns={columns}
                dataSource={data}
                size="middle"
            />

            <Modal
                title={
                    isEditing ? "Shartnomani tahrirlash" : "Shartnoma yaratish"
                }
                open={isModalOpen}
                footer={null}
                onCancel={handleCancel}
            >
                <Form
                    layout="vertical"
                    name="kurs"
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name={"title"}
                        label="Kurs"
                        rules={[
                            {
                                required: true,
                                message: "Kurs nomini kiriting!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        style={{ marginTop: "32px" }}
                        name={"courseId"}
                        label="Nomi"
                        rules={[
                            {
                                required: true,
                                message: "Nomi kiriting!",
                            },
                        ]}
                    >
                        <Input style={{ padding: "12px" }} />
                    </Form.Item>

                    <Form.Item name="attachment">
                        <Upload
                            customRequest={FileUpload}
                            showUploadList={true}
                            maxCount={1}
                            accept=".jpg,.png,.doc,.docx"
                            listType="text"
                            onChange={({ fileList }) => setFileList(fileList)}
                            fileList={fileList}
                        >
                            <Button
                                style={{
                                    color: "#0eb182",
                                    border: "1px dashed #ddd",
                                    padding: "20px 181px",
                                    marginTop: "15px",
                                }}
                                icon={
                                    <PaperClipOutlined
                                        style={{ color: "#0eb182" }}
                                    />
                                }
                            >
                                Fayl biriktiring
                            </Button>
                        </Upload>
                    </Form.Item>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: "20px",
                            marginTop: "32px",
                        }}
                    >
                        <Button
                            style={{ color: "#667085", padding: "10px 16px" }}
                            onClick={handleCancel}
                        >
                            Bekor qilish
                        </Button>

                        <Button
                            style={{
                                backgroundColor: "#0eb182",
                                color: "white",
                                padding: "10px 16px",
                            }}
                            onClick={handleOk}
                        >
                            Saqlash
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

//ps: code uzun bopkentkani uchun uzur boshida ish kamakan dep hammasini bitta joyga yozudim lekin ish kopakan,shuning uchun boshida alohida qimudim codelarni)

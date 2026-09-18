import React, { useContext, useState, type ChangeEvent, type FormEvent } from 'react';
import styles from './AdminPanel.module.scss';
import { ServerContext } from '../../App';
import { IBasePage } from '../PageManager';

// ---------- Types ----------

export type DictionaryName = 'brands' | 'genders' | 'types' | 'sizes' | 'colors';

// ---------- Internal types ----------

type MessageType = 'success' | 'error';

interface Message {
    type: MessageType;
    text: string;
}

type ActiveTab =
    | 'createProduct'
    | 'changeProduct'
    | 'changeOrderStatus'
    | 'addDictionary'
    | 'deleteDictionary';

interface CreateProductForm {
    name: string;
    price: string;
    brandId: string;
    genderId: string;
    typeId: string;
    sizeIds: string;
    colorIds: string;
    stockQuantity: string;
    description: string;
    image: string;
}

interface ChangeProductForm {
    productId: string;
    name: string;
    price: string;
    brandId: string;
    genderId: string;
    typeId: string;
    sizeIds: string;
    colorIds: string;
    stockQuantity: string;
    description: string;
    image: string;
}

interface ChangeOrderStatusForm {
    orderId: string;
    statusId: string;
}

interface AddDictionaryForm {
    dictionary: DictionaryName;
    data: string;
}

interface DeleteDictionaryForm {
    dictionary: DictionaryName;
    dataId: string;
}

type ChangeableField = keyof Omit<ChangeProductForm, 'productId'>;

type ChangeProductFields = Partial<Record<ChangeableField, string | number | number[]>>;

// ---------- Component ----------

const AdminPanel: React.FC<IBasePage> = () => {
    const server = useContext(ServerContext);
    const [activeTab, setActiveTab] = useState<ActiveTab>('createProduct');
    const [message, setMessage] = useState<Message | null>(null);

    const [createProduct, setCreateProduct] = useState<CreateProductForm>({
        name: '',
        price: '',
        brandId: '',
        genderId: '',
        typeId: '',
        sizeIds: '',
        colorIds: '',
        stockQuantity: '',
        description: '',
        image: '',
    });

    const [changeProduct, setChangeProduct] = useState<ChangeProductForm>({
        productId: '',
        name: '',
        price: '',
        brandId: '',
        genderId: '',
        typeId: '',
        sizeIds: '',
        colorIds: '',
        stockQuantity: '',
        description: '',
        image: '',
    });
    const [changeProductFields, setChangeProductFields] = useState<ChangeProductFields>({});

    const [changeOrderStatus, setChangeOrderStatus] = useState<ChangeOrderStatusForm>({
        orderId: '',
        statusId: '',
    });

    const [addDictionary, setAddDictionary] = useState<AddDictionaryForm>({
        dictionary: 'brands',
        data: '',
    });

    const [deleteDictionary, setDeleteDictionary] = useState<DeleteDictionaryForm>({
        dictionary: 'brands',
        dataId: '',
    });

    const showMessage = (type: MessageType, text: string): void => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const parseArray = (str: string): number[] =>
        str
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .map(Number);

    // --- Handlers ---

    const handleCreateProduct = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        server.createProduct({
            name: createProduct.name,
            price: Number(createProduct.price),
            brandId: Number(createProduct.brandId),
            genderId: Number(createProduct.genderId),
            typeId: Number(createProduct.typeId),
            sizeIds: parseArray(createProduct.sizeIds),
            colorIds: parseArray(createProduct.colorIds),
            stockQuantity: Number(createProduct.stockQuantity),
            description: createProduct.description,
            image: createProduct.image,
        });
    };

    const handleChangeProduct = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        type changeProduct = {
            price?: number | undefined;
            brandId?: number | undefined;
            genderId?: number | undefined;
            typeId?: number | undefined;
            sizeIds?: number[] | undefined;
            colorIds?: number[] | undefined;
            stockQuantity?: number | undefined;
            description?: string | undefined;
            name?: string | undefined;
            image?: string | undefined;
        }

        const fields: changeProduct = {};

        if (changeProductFields.name && changeProduct.name !== '') {
            fields.name = changeProduct.name;
        }
        if (changeProductFields.price && changeProduct.price !== '') {
            fields.price = Number(changeProduct.price);
        }
        if (changeProductFields.brandId && changeProduct.brandId !== '') {
            fields.brandId = Number(changeProduct.brandId);
        }
        if (changeProductFields.genderId && changeProduct.genderId !== '') {
            fields.genderId = Number(changeProduct.genderId);
        }
        if (changeProductFields.typeId && changeProduct.typeId !== '') {
            fields.typeId = Number(changeProduct.typeId);
        }
        if (changeProductFields.sizeIds && changeProduct.sizeIds !== '') {
            fields.sizeIds = parseArray(changeProduct.sizeIds);
        }
        if (changeProductFields.colorIds && changeProduct.colorIds !== '') {
            fields.colorIds = parseArray(changeProduct.colorIds);
        }
        if (changeProductFields.stockQuantity && changeProduct.stockQuantity !== '') {
            fields.stockQuantity = Number(changeProduct.stockQuantity);
        }
        if (changeProductFields.description && changeProduct.description !== '') {
            fields.description = changeProduct.description;
        }
        if (changeProductFields.image && changeProduct.image !== '') {
            fields.image = changeProduct.image;
        }

        server.changeProduct({
            productId: Number(changeProduct.productId),
            ...fields,
        });
    };

    const handleChangeOrderStatus = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        server.changeOrderStatus({
            orderId: Number(changeOrderStatus.orderId),
            statusId: Number(changeOrderStatus.statusId),
        });
    };

    const handleAddDictionary = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        server.addDictionaryData({
            dictionary: addDictionary.dictionary,
            data: addDictionary.data,
        });
    };

    const handleDeleteDictionary = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        server.deleteDictionaryData({
            dictionary: deleteDictionary.dictionary,
            dataId: Number(deleteDictionary.dataId),
        });
    };

    // --- Render helpers ---

    interface InputProps {
        label: string;
        value: string;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
        type?: string;
        placeholder?: string;
    }

    const Input: React.FC<InputProps> = ({
        label,
        value,
        onChange,
        type = 'text',
        placeholder = '',
    }) => (
        <div className={styles.formGroup}>
            <label>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={styles.formInput}
            />
        </div>
    );

    interface CheckboxFieldProps {
        label: string;
        checked: boolean;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    }

    const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, checked, onChange }) => (
        <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={checked} onChange={onChange} />
            {label}
        </label>
    );

    interface TabDef {
        id: ActiveTab;
        label: string;
    }

    const tabs: TabDef[] = [
        { id: 'createProduct', label: '4.4.1 Создать товар' },
        { id: 'changeProduct', label: '4.4.2 Изменить товар' },
        { id: 'changeOrderStatus', label: '4.4.3 Статус заказа' },
        { id: 'addDictionary', label: '4.4.4 Добавить в словарь' },
        { id: 'deleteDictionary', label: '4.4.5 Удалить из словаря' },
    ];

    interface ChangeFieldDef {
        key: ChangeableField;
        label: string;
        type?: string;
    }

    const changeFields: ChangeFieldDef[] = [
        { key: 'name', label: 'Название' },
        { key: 'price', label: 'Цена', type: 'number' },
        { key: 'brandId', label: 'ID бренда', type: 'number' },
        { key: 'genderId', label: 'ID гендера', type: 'number' },
        { key: 'typeId', label: 'ID типа', type: 'number' },
        { key: 'sizeIds', label: 'ID размеров (через запятую)' },
        { key: 'colorIds', label: 'ID цветов (через запятую)' },
        { key: 'stockQuantity', label: 'Количество на складе', type: 'number' },
        { key: 'description', label: 'Описание' },
        { key: 'image', label: 'Изображение (URL)' },
    ];

    return (
        <div className={styles.adminPanel}>
            <h1>Админ-панель</h1>

            {message && (
                <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>
            )}

            <div className={styles.tabs}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 4.4.1 CREATE_PRODUCT */}
            {activeTab === 'createProduct' && (
                <form onSubmit={handleCreateProduct}>
                    <fieldset>
                        <legend>Создание нового товара</legend>
                        <Input
                            label="Название товара *"
                            value={createProduct.name}
                            onChange={(e) => setCreateProduct({ ...createProduct, name: e.target.value })}
                        />
                        <div className={styles.fieldRow}>
                            <Input
                                label="Цена *"
                                type="number"
                                value={createProduct.price}
                                onChange={(e) => setCreateProduct({ ...createProduct, price: e.target.value })}
                            />
                            <Input
                                label="Количество на складе *"
                                type="number"
                                value={createProduct.stockQuantity}
                                onChange={(e) =>
                                    setCreateProduct({ ...createProduct, stockQuantity: e.target.value })
                                }
                            />
                        </div>
                        <div className={styles.fieldRow}>
                            <Input
                                label="ID бренда *"
                                type="number"
                                value={createProduct.brandId}
                                onChange={(e) => setCreateProduct({ ...createProduct, brandId: e.target.value })}
                            />
                            <Input
                                label="ID гендера *"
                                type="number"
                                value={createProduct.genderId}
                                onChange={(e) => setCreateProduct({ ...createProduct, genderId: e.target.value })}
                            />
                            <Input
                                label="ID типа *"
                                type="number"
                                value={createProduct.typeId}
                                onChange={(e) => setCreateProduct({ ...createProduct, typeId: e.target.value })}
                            />
                        </div>
                        <Input
                            label="ID размеров (через запятую) *"
                            value={createProduct.sizeIds}
                            onChange={(e) => setCreateProduct({ ...createProduct, sizeIds: e.target.value })}
                            placeholder="1, 2, 3"
                        />
                        <Input
                            label="ID цветов (через запятую) *"
                            value={createProduct.colorIds}
                            onChange={(e) => setCreateProduct({ ...createProduct, colorIds: e.target.value })}
                            placeholder="1, 2, 3"
                        />
                        <Input
                            label="Изображение (URL) *"
                            value={createProduct.image}
                            onChange={(e) => setCreateProduct({ ...createProduct, image: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                        />
                        <div className={styles.formGroup}>
                            <label>Описание *</label>
                            <textarea
                                className={styles.formInput}
                                value={createProduct.description}
                                onChange={(e) =>
                                    setCreateProduct({ ...createProduct, description: e.target.value })
                                }
                            />
                        </div>
                        <button type="submit" className={styles.submitBtn}>
                            Создать товар
                        </button>
                    </fieldset>
                </form>
            )}

            {/* 4.4.2 CHANGE_PRODUCT */}
            {activeTab === 'changeProduct' && (
                <form onSubmit={handleChangeProduct}>
                    <fieldset>
                        <legend>Изменение товара</legend>
                        <Input
                            label="ID товара *"
                            type="number"
                            value={changeProduct.productId}
                            onChange={(e) => setChangeProduct({ ...changeProduct, productId: e.target.value })}
                        />
                        <div className={`${styles.hint} ${styles.hintBlock}`}>
                            Отметьте галочками поля, которые хотите изменить.
                        </div>

                        {changeFields.map(({ key, label, type }) => (
                            <div className={styles.fieldRow} key={key}>
                                <div className={styles.formGroup}>
                                    <label>{label}</label>
                                    {key === 'description' ? (
                                        <textarea
                                            className={styles.formInput}
                                            value={changeProduct[key]}
                                            onChange={(e) =>
                                                setChangeProduct({ ...changeProduct, [key]: e.target.value })
                                            }
                                            disabled={!changeProductFields[key]}
                                        />
                                    ) : (
                                        <input
                                            type={type || 'text'}
                                            className={styles.formInput}
                                            value={changeProduct[key]}
                                            onChange={(e) =>
                                                setChangeProduct({ ...changeProduct, [key]: e.target.value })
                                            }
                                            disabled={!changeProductFields[key]}
                                        />
                                    )}
                                </div>
                                <CheckboxField
                                    label="Изменить"
                                    checked={!!changeProductFields[key]}
                                    onChange={(e) =>
                                        setChangeProductFields({ ...changeProductFields, [key]: e.target.checked })
                                    }
                                />
                            </div>
                        ))}

                        <button type="submit" className={styles.submitBtn}>
                            Изменить товар
                        </button>
                    </fieldset>
                </form>
            )}

            {/* 4.4.3 CHANGE_ORDER_STATUS */}
            {activeTab === 'changeOrderStatus' && (
                <form onSubmit={handleChangeOrderStatus}>
                    <fieldset>
                        <legend>Изменение статуса заказа</legend>
                        <Input
                            label="ID заказа *"
                            type="number"
                            value={changeOrderStatus.orderId}
                            onChange={(e) =>
                                setChangeOrderStatus({ ...changeOrderStatus, orderId: e.target.value })
                            }
                        />
                        <Input
                            label="Новый ID статуса *"
                            type="number"
                            value={changeOrderStatus.statusId}
                            onChange={(e) =>
                                setChangeOrderStatus({ ...changeOrderStatus, statusId: e.target.value })
                            }
                        />
                        <button type="submit" className={styles.submitBtn}>
                            Изменить статус
                        </button>
                    </fieldset>
                </form>
            )}

            {/* 4.4.4 ADD_DICTIONARY_DATA */}
            {activeTab === 'addDictionary' && (
                <form onSubmit={handleAddDictionary}>
                    <fieldset>
                        <legend>Добавление значения в словарь</legend>
                        <div className={styles.formGroup}>
                            <label>Словарь *</label>
                            <select
                                className={styles.formInput}
                                value={addDictionary.dictionary}
                                onChange={(e) =>
                                    setAddDictionary({
                                        ...addDictionary,
                                        dictionary: e.target.value as DictionaryName,
                                    })
                                }
                            >
                                <option value="brands">brands (Бренды)</option>
                                <option value="genders">genders (Гендеры)</option>
                                <option value="types">types (Типы)</option>
                                <option value="sizes">sizes (Размеры)</option>
                                <option value="colors">colors (Цвета)</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Значение *</label>
                            <textarea
                                className={styles.formInput}
                                value={addDictionary.data}
                                onChange={(e) => setAddDictionary({ ...addDictionary, data: e.target.value })}
                                placeholder='Строка или JSON, например: "Nike" или {"name": "Nike", "logo": "..."}'
                            />
                            <div className={styles.hint}>Можно ввести просто строку или JSON-объект.</div>
                        </div>
                        <button type="submit" className={styles.submitBtn}>
                            Добавить в словарь
                        </button>
                    </fieldset>
                </form>
            )}

            {/* 4.4.5 DELETE_DICTIONARY_DATA */}
            {activeTab === 'deleteDictionary' && (
                <form onSubmit={handleDeleteDictionary}>
                    <fieldset>
                        <legend>Удаление значения из словаря</legend>
                        <div className={styles.formGroup}>
                            <label>Словарь *</label>
                            <select
                                className={styles.formInput}
                                value={deleteDictionary.dictionary}
                                onChange={(e) =>
                                    setDeleteDictionary({
                                        ...deleteDictionary,
                                        dictionary: e.target.value as DictionaryName,
                                    })
                                }
                            >
                                <option value="brands">brands (Бренды)</option>
                                <option value="genders">genders (Гендеры)</option>
                                <option value="types">types (Типы)</option>
                                <option value="sizes">sizes (Размеры)</option>
                                <option value="colors">colors (Цвета)</option>
                            </select>
                        </div>
                        <Input
                            label="ID удаляемого значения *"
                            type="number"
                            value={deleteDictionary.dataId}
                            onChange={(e) =>
                                setDeleteDictionary({ ...deleteDictionary, dataId: e.target.value })
                            }
                        />
                        <button type="submit" className={styles.submitBtn}>
                            Удалить из словаря
                        </button>
                    </fieldset>
                </form>
            )}
        </div>
    );
};

export default AdminPanel;
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { MediatorContext, ServerContext } from "../../App";
import { IBasePage, PAGES } from '../PageManager';
import { IDictionaries, IDictionaryItem, IProduct, TError } from '../../services/server/types';
import Button from '../../components/Button/Button';

const Catalogue: React.FC<IBasePage> = (props) => {
    const server = useContext(ServerContext);
    const mediator = useContext(MediatorContext);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [dictionaries, setDictionaries] = useState<IDictionaries | null>(null);
    const [sortBy, setSortBy] = useState<string>('newest');
    const [error, setError] = useState<TError | null>(null);
    const displayError = error?.message;

    const [filters, setFilters] = useState({
        genderId: '',
        typeId: '',
        brandId: '',
        sizeId: '',
        colorId: ''
    });

    useEffect(() => {
        const loadProducts = async () => {
            const [productData, dictData] = await Promise.all([
                server.getProductList(),
                server.getDictionaries()
            ]);
            if (productData) setProducts(productData);
            if (dictData) setDictionaries(dictData);
        };

        loadProducts();
    }, [server]);

    const getType = (dict: IDictionaryItem[] | undefined, id: number): string => {
        if (!dict) return '';
        const item = dict.find(d => d.id === id);
        return item ? item.type : '';
    };

    const filteredProducts = useMemo(() => {
        if (!dictionaries) return [];

        return products.filter((p) => {
            if (filters.genderId) {
                const genderName = getType(dictionaries.genders, Number(filters.genderId));
                if (p.gender !== genderName) return false;
            }
            if (filters.typeId) {
                const typeName = getType(dictionaries.underwearTypes, Number(filters.typeId));
                if (p.type !== typeName) return false;
            }
            if (filters.brandId) {
                const brandName = getType(dictionaries.brands, Number(filters.brandId));
                if (p.brand !== brandName) return false;
            }
            if (filters.sizeId) {
                const sizeName = getType(dictionaries.sizes, Number(filters.sizeId));
                if (!p.sizes.includes(sizeName)) return false;
            }
            if (filters.colorId) {
                const colorName = getType(dictionaries.colors, Number(filters.colorId));
                if (!p.colors.includes(colorName)) return false;
            }
            return true;
        });
    }, [products, filters, dictionaries]);

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price_asc':
                return a.price - b.price;
            case 'price_desc':
                return b.price - a.price;
            case 'newest':
            default:
                return b.id - a.id;
        }
    });

    return (
        <div className="catalog-page">
            <h3>Каталог</h3>
            <div className="filters">
                {dictionaries?.genders && (
                    <select
                        value={filters.genderId}
                        onChange={(e) => setFilters({ ...filters, genderId: e.target.value })}
                    >
                        <option value="">Пол</option>
                        {dictionaries.genders.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.type}
                            </option>
                        ))}
                    </select>
                )}
                {dictionaries?.underwearTypes && (
                    <select
                        value={filters.typeId}
                        onChange={(e) => setFilters({ ...filters, typeId: e.target.value })}
                    >
                        <option value="">Бельё</option>
                        {dictionaries.underwearTypes.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.type}
                            </option>
                        ))}
                    </select>
                )}
                {dictionaries?.brands && (
                    <select
                        value={filters.brandId}
                        onChange={(e) => setFilters({ ...filters, brandId: e.target.value })}
                    >
                        <option value="">Бренд</option>
                        {dictionaries.brands.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.type}
                            </option>
                        ))}
                    </select>
                )}
                {dictionaries?.sizes && (
                    <select
                        value={filters.sizeId}
                        onChange={(e) => setFilters({ ...filters, sizeId: e.target.value })}
                    >
                        <option value="">Размер</option>
                        {dictionaries.sizes.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.type}
                            </option>
                        ))}
                    </select>
                )}
                {dictionaries?.colors && (
                    <select
                        value={filters.colorId}
                        onChange={(e) => setFilters({ ...filters, colorId: e.target.value })}
                    >
                        <option value="">Цвет</option>
                        {dictionaries.colors.map((g) => (
                            <option key={g.id} value={g.id}>
                                {g.type}
                            </option>
                        ))}
                    </select>
                )}

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="newest">По новизне</option>
                    <option value="price_asc">Сначала дешевле</option>
                    <option value="price_desc">Сначала дороже</option>
                </select>
            </div>

            <div className="products-list">
                {displayError && <p id='test-errors-catalogue' className='errors'>{displayError}</p>}
                {sortedProducts.map(p => (
                    <div key={p.id}>{p.name} — {p.price} ₽</div>
                ))}
            </div>
        </div>
    );
}

export default Catalogue;
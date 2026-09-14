import React, { useState } from 'react';
import { IProduct } from '../../services/server/types';
import './ProductMenu.scss';

interface ProductModalProps {
    product: IProduct;
    onClose: () => void;
}

const ProductMenu: React.FC<ProductModalProps> = (props) => {
    const { product, onClose } = props;
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    
    const closeClickHandler = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="product-menu" onClick={closeClickHandler}>
            <div className="menu-body">
                <button className="close-btn" onClick={onClose}>✕</button>
                <div className="menu-image">
                    <span></span>
                </div>

                <div className="menu-info">
                    <div className="menu-name">{product.name}</div>
                    <div className="menu-brand">{product.brand}</div>
                    <div className="menu-desc">{product.description}</div>

                    <div className="menu-details">
                        <div className="menu-sizes">
                            <span className="label">Размеры:</span>
                            <div className="menu-options">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`option ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="menu-colors">
                            <span className="label">Цвета:</span>
                            <div className="menu-options">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        className={`option ${selectedColor === color ? 'active' : ''}`}
                                        onClick={() => setSelectedColor(color)}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="menu-footer">
                        <div className="menu-price">{product.price} ₽</div>
                        <button className="add-to-cart">В корзину</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductMenu;
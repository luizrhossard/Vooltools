import { useCallback, useEffect, useState } from 'react';
import { CartDrawer } from '../components/CartDrawer';
import { Toast } from '../components/Toast';
import { ApiErrorNotice } from '../components/ApiErrorNotice';
import { StoreHeader } from '../components/StoreHeader';
import { HeroSection } from '../components/HeroSection';
import { BenefitsBar } from '../components/BenefitsBar';
import { CategoriesSection } from '../components/CategoriesSection';
import { ProductsSection } from '../components/ProductsSection';
import { BrandsSection } from '../components/BrandsSection';
import { NewsletterSection } from '../components/NewsletterSection';
import { StoreFooter } from '../components/StoreFooter';
import { apiClient, getApiErrorMessage } from '../lib/apiClient';
import { sanitizeProductText } from '../lib/text';
import type { Product, Banner } from '../types/product';

export function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [toast, setToast] = useState({ visible: false, message: '' });

    useEffect(() => {
        setIsLoading(true);
        setLoadError(null);

        Promise.all([
            apiClient.get<Product[]>('/products').then((res) => res.data),
            apiClient.get<Banner[]>('/banners/active').then((res) => res.data)
        ]).then(([productsData, bannersData]) => {
            setProducts(productsData.map((product: Product) => sanitizeProductText(product)));
            setBanners(bannersData);
            setIsLoading(false);
        }).catch((error: unknown) => {
            setLoadError(getApiErrorMessage(error, 'Não foi possível carregar os dados da loja.'));
            setIsLoading(false);
        });
    }, []);

    const hideToast = useCallback(() => {
        setToast(t => ({ ...t, visible: false }));
    }, []);

    return (
        <>
            <StoreHeader />

            <main>
                {loadError && (
                    <section className="cw" style={{ marginTop: '20px' }}>
                        <ApiErrorNotice message={loadError} onRetry={() => window.location.reload()} />
                    </section>
                )}

                <HeroSection banners={banners} products={products} />
                <BenefitsBar />
                <CategoriesSection />
                <ProductsSection products={products} isLoading={isLoading} />
                <BrandsSection />
                <NewsletterSection />
            </main>

            <StoreFooter />

            <button className="btt" title="Topo"><i className="fas fa-chevron-up"></i></button>

            <CartDrawer />

            <Toast
                message={toast.message}
                visible={toast.visible}
                onHide={hideToast}
            />
        </>
    );
}

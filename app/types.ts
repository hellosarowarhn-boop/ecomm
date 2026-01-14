export interface ProductImage {
    url: string;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    original_price: number;
    offer_price: number;
    type: 'single' | 'combo';
    bottle_quantity: number;
    description?: string;
    images: { url: string; name: string }[];
    is_active: boolean;
}

export interface Settings {
    site_name: string;
    site_logo: string;
    favicon?: string;
    footer_logo?: string;
    hero_title?: string;
    hero_description?: string;
    hero_button_text?: string;
    product_button_text?: string;
    combo_button_text?: string;
    contact_phone?: string;
    contact_email?: string;
    contact_address?: string;
    hero_images?: string[];
    faqs?: { question: string; answer: string }[];
}

export interface OrderFormData {
    customer_name: string;
    phone: string;
    city: string;
    address: string;
}

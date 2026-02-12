/**
 * External dependencies
 */
import { store, getContext } from '@wordpress/interactivity';
import type { ProductResponseItem } from '@woocommerce/types';
import type { ProductsStore } from '@woocommerce/stores/woocommerce/products';

// Stores are locked to prevent 3PD usage until the API is stable.
const universalLock =
	'I acknowledge that using a private store means my plugin will inevitably break on the next store release.';

const productsStore = store< ProductsStore >( 'woocommerce/products', {
	state: {
		products: {},
		productVariations: {},
	},
} );

/**
 * The context shape set by the woocommerce/single-product block. When the
 * add-to-cart-with-options block (or any other consumer) renders inside a
 * Single Product block, this per-element context takes precedence over the
 * server-hydrated state so that each product in a loop gets its own IDs.
 */
type SingleProductContext = {
	productId: number;
	variationId: number | null;
};

export type ProductContextState = {
	productId: number;
	variationId: number | null;
	currentProductId: number;
	currentVariationId: number | null;
};

const productContextStore = store< {
	state: ProductContextState & {
		parentProduct: ProductResponseItem | undefined;
		selectedVariation: ProductResponseItem | undefined;
		currentProduct: ProductResponseItem | undefined;
	};
	actions: {
		setProductId: ( productId: number ) => void;
		setVariationId: ( variationId: number | null ) => void;
	};
} >(
	'woocommerce/product-context',
	{
		state: {
			get currentProductId(): number {
				const context = getContext< SingleProductContext >(
					'woocommerce/single-product'
				);
				return (
					context?.productId ?? productContextStore.state.productId
				);
			},
			get currentVariationId(): number | null {
				const context = getContext< SingleProductContext >(
					'woocommerce/single-product'
				);
				return (
					context?.variationId ??
					productContextStore.state.variationId
				);
			},
			get parentProduct(): ProductResponseItem | undefined {
				return productsStore.state.products[
					productContextStore.state.currentProductId
				];
			},
			get selectedVariation(): ProductResponseItem | undefined {
				const { currentVariationId } = productContextStore.state;
				if ( currentVariationId === null ) {
					return undefined;
				}
				return productsStore.state.productVariations[
					currentVariationId
				];
			},
			get currentProduct(): ProductResponseItem | undefined {
				return (
					productContextStore.state.selectedVariation ??
					productContextStore.state.parentProduct
				);
			},
		},
		actions: {
			setProductId: ( productId: number ) => {
				const context = getContext< SingleProductContext >(
					'woocommerce/single-product'
				);
				if ( context?.productId !== undefined ) {
					context.productId = productId;
				} else {
					productContextStore.state.productId = productId;
				}
			},
			setVariationId: ( variationId: number | null ) => {
				const context = getContext< SingleProductContext >(
					'woocommerce/single-product'
				);
				if ( context?.variationId !== undefined ) {
					context.variationId = variationId;
				} else {
					productContextStore.state.variationId = variationId;
				}
			},
		},
	},
	{ lock: universalLock }
);

export type ProductContextStore = typeof productContextStore;

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
import { useMemo } from '@wordpress/element';
import { createSlotFill } from '@wordpress/components';
// eslint-disable-next-line @woocommerce/dependency-group
import {
	ErrorBoundary,
	// @ts-expect-error Type for PluginDocumentSettingPanel is missing in @types/wordpress__editor
	PluginDocumentSettingPanel,
} from '@wordpress/editor';

/**
 * Internal dependencies
 */
import { RichTextWithButton } from '../personalization-tags/rich-text-with-button';
import {
	recordEvent,
	recordEventOnce,
	debouncedRecordEvent,
} from '../../events';

const tracking = {
	recordEvent,
	recordEventOnce,
	debouncedRecordEvent,
};

const { Fill: TemplateSelectionFill, Slot: TemplateSelectionSlot } =
	createSlotFill( 'WooCommerceEmailEditorTemplateSelection' );

export { TemplateSelectionFill };

export function SettingsPanel() {
	const SidebarExtensionComponent = useMemo(
		() =>
			applyFilters(
				'woocommerce_email_editor_setting_sidebar_extension_component',
				RichTextWithButton,
				tracking
			) as () => JSX.Element,
		[]
	);

	const EmailStatusComponent = useMemo(
		() =>
			applyFilters(
				'woocommerce_email_editor_setting_sidebar_email_status_component',
				() => null,
				tracking
			) as () => JSX.Element,
		[]
	);

	return (
		<PluginDocumentSettingPanel
			name="email-settings-panel"
			title={ __( 'Settings', 'woocommerce' ) }
			className="woocommerce-email-editor__settings-panel"
		>
			{ <EmailStatusComponent /> }
			<TemplateSelectionSlot />
			{ /* @ts-expect-error canCopyContent is missing in @types/wordpress__editor */ }
			<ErrorBoundary canCopyContent>
				{ <SidebarExtensionComponent /> }
			</ErrorBoundary>
		</PluginDocumentSettingPanel>
	);
}

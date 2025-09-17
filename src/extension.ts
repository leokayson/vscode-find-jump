import {
	commands,
	ConfigurationChangeEvent,
	ExtensionContext,
	TextEditorDecorationType,
	workspace,
} from "vscode";
import { updateDecorationTypes } from "./decorations";
import { FindJump2 } from "./findJump";
import { subscriptions as inlineInputSubscriptions } from "./inlineInput";
import { ExtensionConfig } from "./types";

export let extensionConfig: ExtensionConfig;

export const enum Const {
	EXTENSION_NAME = "findJump2",
}

export abstract class Global {
	static letterDecorationType: TextEditorDecorationType;
}

export function activate(context: ExtensionContext) {
	extensionConfig = workspace.getConfiguration(
		Const.EXTENSION_NAME
	) as any as ExtensionConfig;
	updateDecorationTypes();
	const findJump2 = new FindJump2();

	context.subscriptions.push(
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateCharStart`,
			findJump2.activateCharStart
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateCharEnd`,
			findJump2.activateCharEnd
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateWordStart`,
			findJump2.activateWordStart
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateWordEnd`,
			findJump2.activateWordEnd
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateCharStartSelection`,
			findJump2.activateCharStartSelection
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateCharEndSelection`,
			findJump2.activateCharEndSelection
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateWordStartSelection`,
			findJump2.activateWordStartSelection
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.activateWordEndSelection`,
			findJump2.activateWordEndSelection
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.cancel`,
			findJump2.cancel
		),
		commands.registerTextEditorCommand(
			`${Const.EXTENSION_NAME}.backspace`,
			findJump2.backspace
		)
	);

	function updateConfig(e: ConfigurationChangeEvent): void {
		if (!e.affectsConfiguration(Const.EXTENSION_NAME)) {
			return;
		}

		extensionConfig = workspace.getConfiguration(
			Const.EXTENSION_NAME
		) as any as ExtensionConfig;
		updateDecorationTypes();
		findJump2.cancel();
	}

	context.subscriptions.push(
		workspace.onDidChangeConfiguration(updateConfig)
	);
}

export function deactivate(): void {
	const subscriptions = [...inlineInputSubscriptions];

	subscriptions.forEach((subscription) => subscription.dispose());
}

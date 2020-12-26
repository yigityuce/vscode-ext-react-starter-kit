/* eslint-disable @typescript-eslint/naming-convention */

import * as path from 'path';
import { ExtensionContext, Uri, ViewColumn, window } from 'vscode';
import { IDestructable } from './interfaces/IDestructable';
import { VStatsStatusBarItem } from './VStatsStatusBarItem';
import { VStatsCommand } from './VStatsCommand';

enum ItemKey {
	STATUS_BAR_ITEM = 'STATUS_BAR_ITEM',
	COMMAND_SHOW = 'vstats.show',
	COMMAND_HIDE = 'vstats.hide',
	COMMAND_SHOW_DETAILED = 'vstats.showdetailed',
}

type ItemType = VStatsStatusBarItem | VStatsCommand;

export class VStats implements IDestructable {
	private items: { [key in ItemKey]: ItemType } = {
		[ItemKey.STATUS_BAR_ITEM]: new VStatsStatusBarItem(ItemKey.COMMAND_SHOW_DETAILED),
		[ItemKey.COMMAND_SHOW]: this.createShowCommand(),
		[ItemKey.COMMAND_HIDE]: this.createHideCommand(),
		[ItemKey.COMMAND_SHOW_DETAILED]: this.createShowDetailedCommand(),
	};

	constructor(private context: ExtensionContext) {
		Object.values(this.items)
			.filter((item) => !!item.dispose)
			.forEach((item) => context.subscriptions.push(item));
	}

	destruct() {
		Object.values(this.items)
			.filter((item) => !!item.destruct)
			.forEach((item) => item.destruct());
	}

	private createShowCommand() {
		return new VStatsCommand(ItemKey.COMMAND_SHOW, () => {
			(this.items[ItemKey.STATUS_BAR_ITEM] as VStatsStatusBarItem).show();
		});
	}

	private createHideCommand() {
		return new VStatsCommand(ItemKey.COMMAND_HIDE, () => {
			(this.items[ItemKey.STATUS_BAR_ITEM] as VStatsStatusBarItem).hide();
		});
	}

	private createShowDetailedCommand() {
		return new VStatsCommand(ItemKey.COMMAND_SHOW_DETAILED, () => {
			const webViewDistpath = path.join(this.context.extensionPath, 'dist', 'webview');
			const panel = window.createWebviewPanel('detailedStats', 'Detailed Stats', ViewColumn.One, {
				enableScripts: true,
				localResourceRoots: [Uri.file(webViewDistpath)],
			});
			const webViewJsUri = Uri.file(path.join(webViewDistpath, 'index.js')).with({ scheme: "vscode-resource" });
			const webViewCssUri = Uri.file(path.join(webViewDistpath, 'styles.css')).with({ scheme: "vscode-resource" });
			const csp = [
				`default-src 'none'`,
				`img-src https:`,
				`script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:`,
				`style-src vscode-resource: 'unsafe-inline'`,
			].join('; ');

			panel.webview.html = `
				<!DOCTYPE html>
				<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<meta http-equiv="Content-Security-Policy" content="${csp}">
						<link rel="stylesheet" href="${webViewCssUri}">
					</head>
					<body>
						<div id="root"></div>
						<script src="${webViewJsUri}"></script>
					</body>
				</html>
			`;
		});
	}
}

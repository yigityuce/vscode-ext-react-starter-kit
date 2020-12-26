import { ExtensionContext } from 'vscode';
import { VStats } from './VStats/VStats';

let vstats: VStats;

// this method is called when your extension is activated
export function activate(context: ExtensionContext) {
	console.log('Congratulations, your extension "vstats" is now active!');
	vstats = new VStats(context);
}

// this method is called when your extension is deactivated
export function deactivate() {
	vstats?.destruct();
}

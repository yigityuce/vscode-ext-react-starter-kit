import { formatDistanceToNow, formatRFC7231 } from 'date-fns';
import { StatusBarAlignment, StatusBarItem, window } from 'vscode';
import { IDestructable } from './interfaces/IDestructable';
import { IDisposable } from './interfaces/IDisposable';
import { vstatsStorage } from './VStatsStorage';

export class VStatsStatusBarItem implements IDestructable, IDisposable {
	private statusBarItem: StatusBarItem;
	private intervalId: NodeJS.Timeout;

	constructor(cmd?: string, position: StatusBarAlignment = StatusBarAlignment.Right) {
		this.statusBarItem = window.createStatusBarItem(position);
		this.statusBarItem.text = formatRFC7231(vstatsStorage.startedAt);
		this.intervalId = setInterval(() => this.updateTooltip(), 10000);
		this.updateTooltip().show();
		if (cmd) {
			this.statusBarItem.command = cmd;
		}
		console.log('StartedAt: ', this.statusBarItem.text);
	}

	destruct() {
		clearInterval(this.intervalId);
	}

	dispose() {
		this.statusBarItem.dispose();
	}

	show(): this {
		this.statusBarItem.show();
		return this;
	}

	hide(): this {
		this.statusBarItem.hide();
		return this;
	}

	private updateTooltip(): this {
		const since = formatDistanceToNow(vstatsStorage.startedAt, { includeSeconds: true });
		this.statusBarItem.tooltip = `You are creating something good since "${since}"`;
		return this;
	}
}

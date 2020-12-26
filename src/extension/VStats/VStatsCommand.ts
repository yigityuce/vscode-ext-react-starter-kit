import { commands, Disposable } from 'vscode';
import { IDestructable } from './interfaces/IDestructable';
import { IDisposable } from './interfaces/IDisposable';

export class VStatsCommand implements IDestructable, IDisposable {
	private cmdInstance: Disposable;

	constructor(cmd: string, handler: (...args: any[]) => any) {
		this.cmdInstance = commands.registerCommand(cmd, handler);
	}

	destruct() {}

	dispose() {
		this.cmdInstance.dispose();
	}
}

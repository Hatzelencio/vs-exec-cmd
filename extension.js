const vscode = require('vscode');
const path   = require('path');
const exec   = require('child_process').exec;

function activate(context) {
    let config  = vscode.workspace.getConfiguration('exec-cmd');
    let channelInfo  = vscode.window.createOutputChannel('Exec Cmd');
    let channelError = vscode.window.createOutputChannel('Exec Cmd:Err');

    let showInOutputMessage = function (message) {
        channelInfo.clear()
        channelInfo.show();
        channelInfo.append(message);
    };

    let showInOutputMessageErr = function (message) {
        channelError.clear()
        channelError.show();
        channelError.append(message);
    };

    let getCurrentTextSelected = function () {
        return vscode.window.activeTextEditor.document.getText(
            vscode.window.activeTextEditor.selection
        );
    };

    let getCurrentFilePathSelected = function () {
        return vscode.window.activeTextEditor.document.fileName;
    };

    let getPathDirectoryFromFilePath = function (filepath) {
        return path.dirname(filepath);
    };

    let executeCommand = function (command, directorypath) {
        let args = {
            cwd: directorypath,
            timeout: config.get('timeout'),
            maxBuffer: config.get('maxBuffer'),
            killSignal: config.get('killSignal')
        };

        exec(command, args, function (error, stdout, stderr) {
          if (error !== null) {
            showInOutputMessageErr(stderr);
          }else{
            showInOutputMessage(stdout);
          }
        });
    };

    let subscription = vscode.commands.registerCommand('exec-cmd.execute', function () {
        let selectedText = getCurrentTextSelected();
        let currentFilePathSelected = getCurrentFilePathSelected();

        if (selectedText && currentFilePathSelected) {
            let currentDirPathSelected  = getPathDirectoryFromFilePath(currentFilePathSelected);

            executeCommand(selectedText, currentDirPathSelected);
        } else {
            vscode.window.showWarningMessage('No hay texto seleccionado');
        }
    });

    context.subscriptions.push(subscription);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;
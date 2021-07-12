// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import * as braces from 'braces'
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'touch.newFile',
    // eslint-disable-next-line no-unused-vars
    (uri: vscode.Uri, uris: vscode.Uri[]) => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      const fsPath = uri.fsPath
      if (fsPath === undefined) {
        vscode.window.showErrorMessage(
          `Please Select The Base Dir to create files`
        )
        return
      }
      vscode.window
        .showInputBox({
          prompt: 'Please enter file mode',
          validateInput: (value) => {
            return value !== null &&
              value !== undefined &&
              value.replace(/\s+/g, '') !== ''
              ? null
              : Promise.reject('Please enter Something')
          },
        })
        .then((value: string | undefined) => {
          if (value !== undefined) {
            const fsPath = uri.fsPath

            let basrDir = fsPath
            const isDir = fs.statSync(fsPath).isDirectory()
            if (!isDir) {
              basrDir = path.dirname(fsPath)
            }
            const result = braces.expand(value)
            result.forEach((v) => {
              const edit = new vscode.WorkspaceEdit()
              edit.createFile(vscode.Uri.file(path.join(basrDir, v)), {
                overwrite: false,
                ignoreIfExists: true,
              })
              vscode.workspace.applyEdit(edit)
            })
          }
        })
    }
  )

  context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() {}

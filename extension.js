const vscode = require("vscode");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const disposable = vscode.commands.registerCommand(
    "extension.createFolderWithFiles",
    async (uri) => {
      if (uri && uri.scheme === "file") {
        const folderName = await vscode.window.showInputBox({
          placeHolder: "Enter name of set",
          prompt: "Please, enter name of folder and files",
        });

        if (folderName) {
          try {
            const folderUri = vscode.Uri.file(
              path.join(uri.fsPath, folderName)
            );

            await vscode.workspace.fs.createDirectory(folderUri);

            const tsFileUri = vscode.Uri.file(
              path.join(folderUri.fsPath, `${folderName}.tsx`)
            );
            const cssFileUri = vscode.Uri.file(
              path.join(folderUri.fsPath, `${folderName}.css`)
            );
            const indexFileUri = vscode.Uri.file(
              path.join(folderUri.fsPath, "index.ts")
            );

            const tsFileContent = Buffer.from(`import "./${folderName}.css"`);

            const cssFileContent = "";

            const indexFileContent = `
import ${folderName} from './${folderName}.jsx';

export { ${folderName} }';
`;

            await writeFile(tsFileUri, tsFileContent);
            await writeFile(cssFileUri, cssFileContent);
            await writeFile(indexFileUri, indexFileContent);
          } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error.message}`);
          }
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

async function writeFile(uri, content) {
  try {
    const buffer = Buffer.from(content, "utf8");
    await vscode.workspace.fs.writeFile(uri, buffer);
  } catch (error) {
    vscode.window.showErrorMessage(`Ошибка при записи в файл: ${uri.fsPath}`);
    throw error;
  }
}

module.exports = {
  activate,
  deactivate,
};

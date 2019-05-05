// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "smooth-scroll" is now active!');

  const linesToScroll = vscode.workspace
    .getConfiguration("extension.vimSmoothScroll")
    .get("linesToScroll");
  const totalDelay = vscode.workspace
    .getConfiguration("extension.vimSmoothScroll")
    .get("totalDelay");
  const linesToScrollPerTick = 1;
  var calculatedDelay = totalDelay / (linesToScroll / linesToScrollPerTick);

  const scroll = (direction, scrolledLines = 0) => {
    if (scrolledLines < linesToScroll) {
      vscode.commands.executeCommand("editorScroll", {
        to: direction,
        by: "line",
        value: linesToScrollPerTick,
        revealCursor: true
      });

      delay(calculatedDelay).then(() => {
        scrolledLines += linesToScrollPerTick;
        scroll(direction, scrolledLines);
      });
    }
  };

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  const scrollUp = vscode.commands.registerCommand(
    "extension.vimSmoothScrollUp",
    () => {
      scroll("up");
    }
  );

  const scrollDown = vscode.commands.registerCommand(
    "extension.vimSmoothScrollDown",
    () => {
      scroll("down");
    }
  );

  context.subscriptions.push(scrollUp);
  context.subscriptions.push(scrollDown);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
};

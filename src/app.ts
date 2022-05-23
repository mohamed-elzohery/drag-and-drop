/// <reference path="models/drag-drop.ts" />
/// <reference path="models/project.ts" />
/// <reference path="decorators/autobind.ts" />
/// <reference path="utils/validation.ts" />
/// <reference path="state/project.ts" />
/// <reference path="components/userInput.ts" />
/// <reference path="components/project-list.ts" />


namespace App {
        new ProjectInput();
        new ProjectList('active');
        new ProjectList('finished');
}
var Component = /** @class */ (function () {
    function Component(tempId, hostId, isAfterStart, elementId) {
        this.templateElement = document.getElementById(tempId);
        this.hostElement = document.getElementById(hostId);
        this.element = this.importTemplateContent().firstElementChild;
        this.attachTemplateElement(isAfterStart);
    }
    Component.prototype.importTemplateContent = function () {
        var importedNode = document.importNode(this.templateElement, true);
        return importedNode.content;
    };
    Component.prototype.attachTemplateElement = function (isAfterStart) {
        this.hostElement.insertAdjacentElement(isAfterStart ? 'afterbegin' : 'beforeend', this.element);
    };
    return Component;
}());
export { Component };

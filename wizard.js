function WizardComponent(element) {
  'use strict';
  this.element_ = element;
  this.init();
}

WizardComponent.prototype.cssClasses = {
  stepsContainer: 'wizard__steps',
  step: 'wizard__step',
  content: 'wizard__content',
  isActive: 'is-active'
};

/*
 * Currently registered steps in the process.
 */
WizardComponent.prototype.steps = [];

WizardComponent.prototype.currentStep = undefined;

/*
* Get the first item of an array or NodeList.
*/
WizardComponent.prototype.getFirstItem_ = function(target) {
  'use strict';
  for (var i in target) {
    return target[i];
  }
};

// Unused right now, but may come in handy later.
// WizardComponent.prototype.getLastStep_ = function() {
// 'use strict';
// return this.steps[this.steps.length - 1];
// };

WizardComponent.prototype.getNextStep_ = function() {
  'use strict';
  var next = false;
  for (var i in this.steps) {
    if (next) {
      return this.steps[i];
    }
    if (this.currentStep === this.steps[i].name) {
      next = true;
    }
  }
  return false;
};

WizardComponent.prototype.getPreviousStep_ = function() {
  'use strict';
  var previous = false;
  for (var i = this.steps.length - 1; i >= 0; --i) {
    if (previous) {
      return this.steps[i];
    }
    if (this.steps[i].name === this.currentStep) {
      previous = true;
    }
  }
  return false;
};

WizardComponent.prototype.getStepByName_ = function(name) {
  'use strict';
  for (var i in this.steps) {
    if (this.steps[i].name === name) {
      return this.steps[i];
    }
  }
  throw new Error('The step ' + name + ' is not registered.');
};

WizardComponent.prototype.activate_ = function(step) {
  'use strict';
  step.contentNode.classList.add(this.cssClasses.isActive);
  step.contentNode.setAttribute('aria-hidden', false);
  this.currentStep = step.name;
};

WizardComponent.prototype.deactive_ = function(step) {
  'use strict';
  step.contentNode.classList.remove(this.cssClasses.isActive);
  step.contentNode.setAttribute('aria-hidden', true);
};

WizardComponent.prototype.init = function() {
  'use strict';
  var steps = this.element_.querySelectorAll('.' + this.cssClasses.step);
  for (var i = 0, l = steps.length; i < l; i++) {
    var step = steps[i];
    var obj = {
      name: step.dataset.wizardStep,
      contentNode: this.element_.querySelector(
          '.' + this.cssClasses.content +
          '[data-wizard-step="' + step.dataset.wizardStep + '"]'
          )
    }
    this.steps.push(obj);
  }
  var firstStep = this.getFirstItem_(this.steps);
  firstStep.contentNode.classList.add(this.cssClasses.isActive);
  this.currentStep = firstStep.name;

  // Hack the button handlers, do better later.
  this.element_.querySelector(
  '[data-wizard-button="next"]'
  ).addEventListener('click', this.next.bind(this));

  this.element_.querySelector(
      '[data-wizard-button="previous"]'
  ).addEventListener('click', this.previous.bind(this));

};

WizardComponent.prototype.next = function() {
  'use strict';
  var next = this.getNextStep_();
  if (next) {
    this.goto(next.name);
  }
};

WizardComponent.prototype.previous = function() {
  'use strict';
  var previous = this.getPreviousStep_();
  if (previous) {
    this.goto(previous.name);
  }
};

WizardComponent.prototype.goto = function(name) {
  'use strict';
  var target = this.getStepByName_(name);
  var current = this.getStepByName_(this.currentStep);
  this.deactive_(current);
  this.activate_(target);
  // Fire moved event
};

WizardComponent.prototype.addStep = function(obj) {
  throw 'Not yet implemented';
};

WizardComponent.prototype.removeStep = function(obj) {
  throw 'Not yet implemented';
};

componentHandler.register({
  constructor: WizardComponent,
  cssClass: 'component-js-wizard',
  classAsString: 'WizardComponent',
  widget: true
});

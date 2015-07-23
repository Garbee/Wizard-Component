function WizardComponent(element) {
  'use strict';
  this.element_ = element;
  this.currentStep = undefined;
  this.steps = [];
  this.stepNames = [];
  this.init();
}

WizardComponent.prototype.cssClasses = {
  stepsContainer: 'wizard__steps',
  step: 'wizard__step',
  content: 'wizard__content',
  isActive: 'is-active'
};

WizardComponent.prototype.syncStepNames_ = function() {
  'use strict';
  this.stepsNames = [];
  var target = this;
  this.steps.forEach(function(item) {
    target.stepNames.push(item.name);
  });
};

WizardComponent.prototype.getStepPlace_ = function(stepName) {
  'use strict';
  if (typeof stepName !== 'string') {
    throw new Error('Please provide the name of the step to get the placement of.');
  }
  return this.stepNames.indexOf(stepName);
};

/*
* Get the first item of an array or NodeList.
*/
WizardComponent.prototype.getFirstItem_ = function(target) {
  'use strict';
  for (var i in target) {
    return target[i];
  }
};

WizardComponent.prototype.getLastStep_ = function() {
'use strict';
return this.steps[this.steps.length - 1];
};

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
  this.element_.querySelector(
    '.' + this.cssClasses.step +
    '[data-wizard-step="' + step.contentNode.dataset.wizardStep + '"]'
  ).classList.add(this.cssClasses.isActive);
};

WizardComponent.prototype.deactive_ = function(step) {
  'use strict';
  step.contentNode.classList.remove(this.cssClasses.isActive);
  step.contentNode.setAttribute('aria-hidden', true);
  this.element_.querySelector(
    '.' + this.cssClasses.step +
    '[data-wizard-step="' + step.contentNode.dataset.wizardStep + '"]'
    ).classList.remove(this.cssClasses.isActive);
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
    };
    this.steps.push(obj);
  }
  var firstStep = this.getFirstItem_(this.steps);
  firstStep.contentNode.classList.add(this.cssClasses.isActive);
  this.currentStep = firstStep.name;
  this.element_.querySelector(
          '.' + this.cssClasses.step +
          '[data-wizard-step="' + firstStep.contentNode.dataset.wizardStep + '"]'
          ).classList.add(this.cssClasses.isActive);
  // Hack the button handlers, do better later.
  this.element_.querySelector(
  '[data-wizard-button="next"]'
  ).addEventListener('click', this.next.bind(this));

  var previousButton = this.element_.querySelector(
      '[data-wizard-button="previous"]'
  );
  previousButton.disabled = true;
  previousButton.addEventListener('click', this.previous.bind(this));
  this.syncStepNames_();
};

WizardComponent.prototype.next = function() {
  'use strict';
  var next = this.getNextStep_();
  if (next) {
    this.goto(next.name);
  }
  var previousButton = this.element_.querySelector('[data-wizard-button="previous"]');
  if (previousButton.disabled) {
    previousButton.removeAttribute('disabled');
  }
};

WizardComponent.prototype.previous = function() {
  'use strict';
  var previous = this.getPreviousStep_();
  if (previous) {
    this.goto(previous.name);
  }
};

WizardComponent.prototype.getDirectionTo_ = function(targetName) {
  'use strict';
  var targetPosition = this.getStepPlace_(targetName);
  var currentPosition = this.getStepPlace_(this.currentStep);

  if (targetPosition < currentPosition) {
    return 'backward';
  }

  return 'forward';
};

WizardComponent.prototype.goto = function(name) {
  'use strict';
  if (name === undefined) {
    throw new Error('Please provide a step name to go to.');
  }
  var direction = this.getDirectionTo_(name);
  var target = this.getStepByName_(name);
  var current = this.getStepByName_(this.currentStep);
  var preEvent = new CustomEvent('wizard-moving', {
    detail: {
      currentStep: current,
      targetStep: target,
      direction: direction
    },
    cancelable: true,
    bubbles: true
  });

  this.element_.dispatchEvent(preEvent);
  if (preEvent.defaultPrevented) {
    return;
  }

  this.deactive_(current);
  this.activate_(target);

  var previousButton = this.element_.querySelector('[data-wizard-button="previous"]');
  if (direction === 'backward' && this.currentStep === this.getFirstItem_(this.steps).name) {
    previousButton.disabled = true;
  }

  if (direction === 'forward') {
    previousButton.removeAttribute('diabled');
  }

  this.element_.dispatchEvent(new CustomEvent('wizard-moved', {
    detail: {
      oldStep: current,
      currentStep: target,
      direction: direction
    },
    bubbles: true
  }));

  if(this.currentStep === this.getLastStep_().name) {
    this.element_.dispatchEvent(new CustomEvent('wizard-onLastStep', {
    detail: {,
      step: target,
      direction: direction
    },
    bubbles: true
  }));
  }
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

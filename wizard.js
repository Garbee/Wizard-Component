function WizardComponent(element) {
  'use strict';
  this.element_ = element;
  this.currentStep = undefined;
  this.steps = [];
  this.init();
}

WizardComponent.prototype.cssClasses = {
  stepsContainer: 'wizard__steps',
  step: 'wizard__step',
  content: 'wizard__content',
  isActive: 'is-active'
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
    }
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

};

WizardComponent.prototype.next = function() {
  'use strict';
  var next = this.getNextStep_();
  if (next) {
    this.goto(next.name, 'forward');
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
    this.goto(previous.name, 'backward');
  }
  if (previous.name === this.getFirstItem_(this.steps).name) {
    this.element_.querySelector('[data-wizard-button="previous"]').disabled = true;
  }
};

WizardComponent.prototype.goto = function(name, direction) {
  'use strict';
  if (name === undefined) {
    throw new Error('Please provide a step name to go to.');
  }
  var target = this.getStepByName_(name);
  var current = this.getStepByName_(this.currentStep);
  var details = {
      currentStep: current,
      targetStep: target,
    };
  if (direction !== undefined && typeof direction === 'string') {
    eventDetails.direction = direction;
  }
  var preEvent = new CustomEvent('wizardMoving', {
    detail: details
  });

  this.element_.dispatchEvent(preEvent);
  if (preEvent.defaultPrevented) {
    return;
  }

  this.deactive_(current);
  this.activate_(target);

  var eventDetails = {
      oldStep: current,
      currentStep: target,
    };
  if (direction !== undefined && typeof direction === 'string') {
    eventDetails.direction = direction;
  }
  this.element_.dispatchEvent(new CustomEvent('wizardMoved', {
    detail: eventDetails
  }));
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

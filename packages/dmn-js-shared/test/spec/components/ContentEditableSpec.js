/* global sinon */

import TestContainerSupport from 'mocha-test-container-support';

import { Component, render } from 'inferno';

import {
  matches
} from 'min-dom';

import {
  findRenderedDOMElementWithClass,
  findVNodeWithType
} from 'inferno-test-utils';

import {
  triggerInputEvent
} from 'test/util/EventUtil';

import ContentEditable from 'lib/components/ContentEditable';


describe('ContentEditable', function() {

  var container, vTree;

  function renderToNode(vnode) {
    const tree = renderIntoDocument(vnode);

    return findRenderedDOMElementWithClass(tree, 'content-editable');
  }

  function renderIntoDocument(vNode) {
    vTree = render(vNode, container);
    return vTree;
  }

  beforeEach(function() {
    container = TestContainerSupport.get(this);
  });

  afterEach(function() {
    render(null, container);
  });



  it('should render', function() {

    // given
    // text + whitespace + to-be-escaped HTML snippet
    var text = 'FOO <br/> BAR';

    // when
    const node = renderToNode(<ContentEditable className={ 'other' } text={ text } />);

    // then
    expect(node).to.exist;
    expect(node.innerText).to.eql(text);

    expect(matches(node, '.other')).to.be.true;
  });


  it('should not rerender', function() {

    // given
    class Mock extends Component {
      constructor(props, context) {
        super(props, context);

        this.state = {
          text: 'FOO'
        };
      }

      render() {
        const { text } = this.state;

        return <ContentEditable text={ text } />;
      }
    }

    const vNodeTree = <Mock />;

    renderIntoDocument(vNodeTree);

    const mock = findVNodeWithType(vNodeTree, Mock);

    const contentEditable = findVNodeWithType(vNodeTree, ContentEditable);

    const spy = sinon.spy(contentEditable.children, 'render');

    // when
    mock.children.setState({
      text: 'FOO'
    });

    // then
    expect(spy).to.not.have.been.called;
  });


  describe('hooks', function() {

    it('should dispatch onFocus / onBlur', function() {

      // given
      var onBlur = sinon.spy();
      var onFocus = sinon.spy();

      const node = renderToNode(
        <ContentEditable
          onFocus={ onFocus }
          onBlur={ onBlur }
          text={ 'FOO' } />
      );

      // when
      node.focus();

      // then
      expect(onFocus).to.have.been.called;
      expect(onBlur).not.to.have.been.called;

      // when (2)
      node.blur();

      // then
      expect(onBlur).to.have.been.called;
    });


    it('should dispatch onInput', function() {

      // given
      var onInput = sinon.spy();

      const node = renderToNode(<ContentEditable onInput={ onInput } text={ 'FOO' } />);

      // when
      triggerInputEvent(node, 'BLUB');

      // then
      expect(node.innerText).to.eql('BLUB');

      expect(onInput).to.have.been.calledWith('BLUB');
    });

  });

});
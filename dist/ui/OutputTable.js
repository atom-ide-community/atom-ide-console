"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _collection = require("@atom-ide-community/nuclide-commons/collection");

var _UniversalDisposable = _interopRequireDefault(require("@atom-ide-community/nuclide-commons/UniversalDisposable"));

var _nullthrows = _interopRequireDefault(require("nullthrows"));

var _observableDom = require("@atom-ide-community/nuclide-commons-ui/observable-dom");

var _Hasher = _interopRequireDefault(require("@atom-ide-community/nuclide-commons/Hasher"));

var React = _interopRequireWildcard(require("react"));

var _List = _interopRequireDefault(require("react-virtualized/dist/commonjs/List"));

var _rxjsCompatUmdMin = require("rxjs-compat/bundles/rxjs-compat.umd.min.js");

var _RecordView = _interopRequireDefault(require("./RecordView"));

var _recordsChanged = _interopRequireDefault(require("../recordsChanged"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-enable react/no-unused-prop-types */
// The number of extra rows to render beyond what is visible
const OVERSCAN_COUNT = 5;
const INITIAL_RECORD_HEIGHT = 21;

class OutputTable extends React.Component {
  // This is a <List> from react-virtualized (untyped library)
  // The currently rendered range.
  // ExpressionTreeComponent expects an expansionStateId which is a stable
  // object instance across renders, but is unique across consoles. We
  // technically support multiple consoles in the UI, so here we ensure these
  // references are local to the OutputTable instance.
  constructor(props) {
    super(props);
    this._disposable = void 0;
    this._hasher = void 0;
    this._list = void 0;
    this._wrapper = void 0;
    this._renderedRecords = new Map();
    this._startIndex = void 0;
    this._stopIndex = void 0;
    this._refs = void 0;
    this._heights = new _collection.DefaultWeakMap(() => INITIAL_RECORD_HEIGHT);
    this._expansionStateIds = new _collection.DefaultWeakMap(() => ({}));
    this._heightChanges = new _rxjsCompatUmdMin.Subject();

    this._handleRef = node => {
      this._refs.next(node);
    };

    this._recomputeRowHeights = () => {
      // The react-virtualized List component is provided the row heights
      // through a function, so it has no way of knowing that a row's height
      // has changed unless we explicitly notify it to recompute the heights.
      if (this._list == null) {
        return;
      } // $FlowIgnore Untyped react-virtualized List component method


      this._list.recomputeRowHeights(); // If we are already scrolled to the bottom, scroll to ensure that the scrollbar remains at
      // the bottom. This is important not just for if the last record changes height through user
      // interaction (e.g. expanding a debugger variable), but also because this is the mechanism
      // through which the record's true initial height is reported. Therefore, we may have scrolled
      // to the bottom, and only afterwards received its true height. In this case, it's important
      // that we then scroll to the new bottom.


      if (this.props.shouldScrollToBottom()) {
        this.scrollToBottom();
      }
    };

    this._handleListRender = opts => {
      this._startIndex = opts.startIndex;
      this._stopIndex = opts.stopIndex;
    };

    this._getExecutor = id => {
      return this.props.getExecutor(id);
    };

    this._getProvider = id => {
      return this.props.getProvider(id);
    };

    this._renderRow = rowMetadata => {
      const {
        index,
        style
      } = rowMetadata;
      const record = this.props.records[index];
      const key = record.messageId != null ? `messageId:${record.messageId}` : `recordHash:${this._hasher.getHash(record)}`;
      return /*#__PURE__*/React.createElement("div", {
        key: key,
        className: "console-table-row-wrapper",
        style: style
      }, /*#__PURE__*/React.createElement(_RecordView.default // eslint-disable-next-line nuclide-internal/jsx-simple-callback-refs
      , {
        ref: view => {
          if (view != null) {
            this._renderedRecords.set(record, view);
          } else {
            this._renderedRecords.delete(record);
          }
        },
        getExecutor: this._getExecutor,
        getProvider: this._getProvider,
        record: record,
        expansionStateId: this._expansionStateIds.get(record),
        showSourceLabel: this.props.showSourceLabels,
        onHeightChange: this._handleRecordHeightChange
      }));
    };

    this._getRowHeight = ({
      index
    }) => {
      return this._heights.get(this.props.records[index]);
    };

    this._handleTableWrapper = tableWrapper => {
      this._wrapper = tableWrapper;
    };

    this._handleListRef = listRef => {
      const previousValue = this._list;
      this._list = listRef; // The child rows render before this ref gets set. So, if we are coming from
      // a state where the ref was null, we should ensure we notify
      // react-virtualized that we have measurements.

      if (previousValue == null && this._list != null) {
        this._heightChanges.next(null);
      }
    };

    this._handleResize = (height, width) => {
      if (height === this.state.height && width === this.state.width) {
        return;
      }

      this.setState({
        width,
        height
      }); // When this component resizes, the inner records will
      // also resize and potentially have their heights change
      // So we measure all of their heights again here

      this._renderedRecords.forEach(recordView => recordView.measureAndNotifyHeight());
    };

    this._handleRecordHeightChange = (record, newHeight) => {
      const oldHeight = this._heights.get(record);

      if (oldHeight !== newHeight) {
        this._heights.set(record, newHeight);

        this._heightChanges.next(null);
      }
    };

    this._onScroll = ({
      clientHeight,
      scrollHeight,
      scrollTop
    }) => {
      this.props.onScroll(clientHeight, scrollHeight, scrollTop);
    };

    this._disposable = new _UniversalDisposable.default();
    this._hasher = new _Hasher.default();
    this.state = {
      width: 0,
      height: 0
    };
    this._startIndex = 0;
    this._stopIndex = 0;
    this._refs = new _rxjsCompatUmdMin.Subject();

    this._disposable.add(this._heightChanges.subscribe(() => {
      // Theoretically we should be able to (trailing) throttle this to once
      // per render/paint using microtask, but I haven't been able to get it
      // to work without seeing visible flashes of collapsed output.
      this._recomputeRowHeights();
    }), this._refs.filter(Boolean).switchMap(node => new _observableDom.ResizeObservable((0, _nullthrows.default)(node)).mapTo(node)).subscribe(node => {
      const {
        offsetHeight,
        offsetWidth
      } = (0, _nullthrows.default)(node);

      this._handleResize(offsetHeight, offsetWidth);
    }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this._list != null && (0, _recordsChanged.default)(prevProps.records, this.props.records)) {
      // $FlowIgnore Untyped react-virtualized List method
      this._list.recomputeRowHeights();
    }

    if (prevProps.fontSize !== this.props.fontSize) {
      this._renderedRecords.forEach(recordView => recordView.measureAndNotifyHeight());
    }
  }

  componentWillUnmount() {
    this._disposable.dispose();
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "console-table-wrapper",
      ref: this._handleRef,
      tabIndex: "1"
    }, this._containerRendered() ? /*#__PURE__*/React.createElement(_List.default // $FlowFixMe(>=0.53.0) Flow suppress
    , {
      ref: this._handleListRef,
      height: this.state.height,
      width: this.state.width,
      rowCount: this.props.records.length,
      rowHeight: this._getRowHeight,
      rowRenderer: this._renderRow,
      overscanRowCount: OVERSCAN_COUNT,
      onScroll: this._onScroll,
      onRowsRendered: this._handleListRender
    }) : null);
  }

  scrollToBottom() {
    if (this._list != null) {
      // $FlowIgnore Untyped react-virtualized List method
      this._list.scrollToRow(this.props.records.length - 1);
    }
  }

  _containerRendered() {
    return this.state.width !== 0 && this.state.height !== 0;
  }

}

exports.default = OutputTable;
module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk91dHB1dFRhYmxlLmpzIl0sIm5hbWVzIjpbIk9WRVJTQ0FOX0NPVU5UIiwiSU5JVElBTF9SRUNPUkRfSEVJR0hUIiwiT3V0cHV0VGFibGUiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJfZGlzcG9zYWJsZSIsIl9oYXNoZXIiLCJfbGlzdCIsIl93cmFwcGVyIiwiX3JlbmRlcmVkUmVjb3JkcyIsIk1hcCIsIl9zdGFydEluZGV4IiwiX3N0b3BJbmRleCIsIl9yZWZzIiwiX2hlaWdodHMiLCJEZWZhdWx0V2Vha01hcCIsIl9leHBhbnNpb25TdGF0ZUlkcyIsIl9oZWlnaHRDaGFuZ2VzIiwiU3ViamVjdCIsIl9oYW5kbGVSZWYiLCJub2RlIiwibmV4dCIsIl9yZWNvbXB1dGVSb3dIZWlnaHRzIiwicmVjb21wdXRlUm93SGVpZ2h0cyIsInNob3VsZFNjcm9sbFRvQm90dG9tIiwic2Nyb2xsVG9Cb3R0b20iLCJfaGFuZGxlTGlzdFJlbmRlciIsIm9wdHMiLCJzdGFydEluZGV4Iiwic3RvcEluZGV4IiwiX2dldEV4ZWN1dG9yIiwiaWQiLCJnZXRFeGVjdXRvciIsIl9nZXRQcm92aWRlciIsImdldFByb3ZpZGVyIiwiX3JlbmRlclJvdyIsInJvd01ldGFkYXRhIiwiaW5kZXgiLCJzdHlsZSIsInJlY29yZCIsInJlY29yZHMiLCJrZXkiLCJtZXNzYWdlSWQiLCJnZXRIYXNoIiwidmlldyIsInNldCIsImRlbGV0ZSIsImdldCIsInNob3dTb3VyY2VMYWJlbHMiLCJfaGFuZGxlUmVjb3JkSGVpZ2h0Q2hhbmdlIiwiX2dldFJvd0hlaWdodCIsIl9oYW5kbGVUYWJsZVdyYXBwZXIiLCJ0YWJsZVdyYXBwZXIiLCJfaGFuZGxlTGlzdFJlZiIsImxpc3RSZWYiLCJwcmV2aW91c1ZhbHVlIiwiX2hhbmRsZVJlc2l6ZSIsImhlaWdodCIsIndpZHRoIiwic3RhdGUiLCJzZXRTdGF0ZSIsImZvckVhY2giLCJyZWNvcmRWaWV3IiwibWVhc3VyZUFuZE5vdGlmeUhlaWdodCIsIm5ld0hlaWdodCIsIm9sZEhlaWdodCIsIl9vblNjcm9sbCIsImNsaWVudEhlaWdodCIsInNjcm9sbEhlaWdodCIsInNjcm9sbFRvcCIsIm9uU2Nyb2xsIiwiVW5pdmVyc2FsRGlzcG9zYWJsZSIsIkhhc2hlciIsImFkZCIsInN1YnNjcmliZSIsImZpbHRlciIsIkJvb2xlYW4iLCJzd2l0Y2hNYXAiLCJSZXNpemVPYnNlcnZhYmxlIiwibWFwVG8iLCJvZmZzZXRIZWlnaHQiLCJvZmZzZXRXaWR0aCIsImNvbXBvbmVudERpZFVwZGF0ZSIsInByZXZQcm9wcyIsInByZXZTdGF0ZSIsImZvbnRTaXplIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwicmVuZGVyIiwiX2NvbnRhaW5lclJlbmRlcmVkIiwibGVuZ3RoIiwic2Nyb2xsVG9Sb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFvQ0E7QUFFQTtBQUNBLE1BQU1BLGNBQWMsR0FBRyxDQUF2QjtBQUNBLE1BQU1DLHFCQUFxQixHQUFHLEVBQTlCOztBQUVlLE1BQU1DLFdBQU4sU0FBMEJDLEtBQUssQ0FBQ0MsU0FBaEMsQ0FBd0Q7QUFHckU7QUFLQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBSUFDLEVBQUFBLFdBQVcsQ0FBQ0MsS0FBRCxFQUFlO0FBQ3hCLFVBQU1BLEtBQU47QUFEd0IsU0FuQjFCQyxXQW1CMEI7QUFBQSxTQWxCMUJDLE9Ba0IwQjtBQUFBLFNBaEIxQkMsS0FnQjBCO0FBQUEsU0FmMUJDLFFBZTBCO0FBQUEsU0FkMUJDLGdCQWMwQixHQWRrQixJQUFJQyxHQUFKLEVBY2xCO0FBQUEsU0FYMUJDLFdBVzBCO0FBQUEsU0FWMUJDLFVBVTBCO0FBQUEsU0FUMUJDLEtBUzBCO0FBQUEsU0FSMUJDLFFBUTBCLEdBUmlCLElBQUlDLDBCQUFKLENBQW1CLE1BQU1oQixxQkFBekIsQ0FRakI7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O0FBU0UsTUFBQSxRQUFRLEVBQUUsS0FBS29FLFNBVGpCO0FBVUUsTUFBQSxjQUFjLEVBQUUsS0FBS3hDO0FBVnZCLE1BREQsR0FhRyxJQWROLENBREY7QUFrQkQ7O0FBNEJERCxFQUFBQSxjQUFjLEdBQVM7QUFDckIsUUFBSSxLQUFLbEIsS0FBTCxJQUFjLElBQWxCLEVBQXdCO0FBQ3RCO0FBQ0EsV0FBS0EsS0FBTCxDQUFXb0YsV0FBWCxDQUF1QixLQUFLdkYsS0FBTCxDQUFXb0MsT0FBWCxDQUFtQmtELE1BQW5CLEdBQTRCLENBQW5EO0FBQ0Q7QUFDRjs7QUFzQ0RELEVBQUFBLGtCQUFrQixHQUFZO0FBQzVCLFdBQU8sS0FBSzlCLEtBQUwsQ0FBV0QsS0FBWCxLQUFxQixDQUFyQixJQUEwQixLQUFLQyxLQUFMLENBQVdGLE1BQVgsS0FBc0IsQ0FBdkQ7QUFDRDs7QUE5Sm9FIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBFeGVjdXRvciwgUmVjb3JkLCBTb3VyY2VJbmZvIH0gZnJvbSBcIi4uL3R5cGVzXCJcblxuaW1wb3J0IHsgRGVmYXVsdFdlYWtNYXAgfSBmcm9tIFwiQGF0b20taWRlLWNvbW11bml0eS9udWNsaWRlLWNvbW1vbnMvY29sbGVjdGlvblwiXG5pbXBvcnQgVW5pdmVyc2FsRGlzcG9zYWJsZSBmcm9tIFwiQGF0b20taWRlLWNvbW11bml0eS9udWNsaWRlLWNvbW1vbnMvVW5pdmVyc2FsRGlzcG9zYWJsZVwiXG5pbXBvcnQgbnVsbFRocm93cyBmcm9tIFwibnVsbHRocm93c1wiXG5pbXBvcnQgeyBSZXNpemVPYnNlcnZhYmxlIH0gZnJvbSBcIkBhdG9tLWlkZS1jb21tdW5pdHkvbnVjbGlkZS1jb21tb25zLXVpL29ic2VydmFibGUtZG9tXCJcbmltcG9ydCBIYXNoZXIgZnJvbSBcIkBhdG9tLWlkZS1jb21tdW5pdHkvbnVjbGlkZS1jb21tb25zL0hhc2hlclwiXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIlxuaW1wb3J0IExpc3QgZnJvbSBcInJlYWN0LXZpcnR1YWxpemVkL2Rpc3QvY29tbW9uanMvTGlzdFwiXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSBcInJ4anMtY29tcGF0L2J1bmRsZXMvcnhqcy1jb21wYXQudW1kLm1pbi5qc1wiXG5pbXBvcnQgUmVjb3JkVmlldyBmcm9tIFwiLi9SZWNvcmRWaWV3XCJcbmltcG9ydCByZWNvcmRzQ2hhbmdlZCBmcm9tIFwiLi4vcmVjb3Jkc0NoYW5nZWRcIlxuXG50eXBlIFByb3BzID0ge1xuICByZWNvcmRzOiBBcnJheTxSZWNvcmQ+LFxuICBzaG93U291cmNlTGFiZWxzOiBib29sZWFuLFxuICBmb250U2l6ZTogbnVtYmVyLFxuICBnZXRFeGVjdXRvcjogKGlkOiBzdHJpbmcpID0+ID9FeGVjdXRvcixcbiAgZ2V0UHJvdmlkZXI6IChpZDogc3RyaW5nKSA9PiA/U291cmNlSW5mbyxcbiAgb25TY3JvbGw6IChvZmZzZXRIZWlnaHQ6IG51bWJlciwgc2Nyb2xsSGVpZ2h0OiBudW1iZXIsIHNjcm9sbFRvcDogbnVtYmVyKSA9PiB2b2lkLFxuICBzaG91bGRTY3JvbGxUb0JvdHRvbTogKCkgPT4gYm9vbGVhbixcbn1cblxudHlwZSBTdGF0ZSA9IHtcbiAgd2lkdGg6IG51bWJlcixcbiAgaGVpZ2h0OiBudW1iZXIsXG59XG5cbnR5cGUgUm93UmVuZGVyZXJQYXJhbXMgPSB7XG4gIGluZGV4OiBudW1iZXIsXG4gIGtleTogc3RyaW5nLFxuICBzdHlsZTogT2JqZWN0LFxuICBpc1Njcm9sbGluZzogYm9vbGVhbixcbn1cblxudHlwZSBSb3dIZWlnaHRQYXJhbXMgPSB7XG4gIC8vIFRoZXNlIGFyZSBub3QgcHJvcHMgdG8gYSBjb21wb25lbnRcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0L25vLXVudXNlZC1wcm9wLXR5cGVzXG4gIGluZGV4OiBudW1iZXIsXG59XG5cbi8qIGVzbGludC1kaXNhYmxlIHJlYWN0L25vLXVudXNlZC1wcm9wLXR5cGVzICovXG50eXBlIE9uU2Nyb2xsUGFyYW1zID0ge1xuICBjbGllbnRIZWlnaHQ6IG51bWJlcixcbiAgc2Nyb2xsSGVpZ2h0OiBudW1iZXIsXG4gIHNjcm9sbFRvcDogbnVtYmVyLFxufVxuLyogZXNsaW50LWVuYWJsZSByZWFjdC9uby11bnVzZWQtcHJvcC10eXBlcyAqL1xuXG4vLyBUaGUgbnVtYmVyIG9mIGV4dHJhIHJvd3MgdG8gcmVuZGVyIGJleW9uZCB3aGF0IGlzIHZpc2libGVcbmNvbnN0IE9WRVJTQ0FOX0NPVU5UID0gNVxuY29uc3QgSU5JVElBTF9SRUNPUkRfSEVJR0hUID0gMjFcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3V0cHV0VGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8UHJvcHMsIFN0YXRlPiB7XG4gIF9kaXNwb3NhYmxlOiBVbml2ZXJzYWxEaXNwb3NhYmxlXG4gIF9oYXNoZXI6IEhhc2hlcjxSZWNvcmQ+XG4gIC8vIFRoaXMgaXMgYSA8TGlzdD4gZnJvbSByZWFjdC12aXJ0dWFsaXplZCAodW50eXBlZCBsaWJyYXJ5KVxuICBfbGlzdDogP1JlYWN0LkVsZW1lbnQ8YW55PlxuICBfd3JhcHBlcjogP0hUTUxFbGVtZW50XG4gIF9yZW5kZXJlZFJlY29yZHM6IE1hcDxSZWNvcmQsIFJlY29yZFZpZXc+ID0gbmV3IE1hcCgpXG5cbiAgLy8gVGhlIGN1cnJlbnRseSByZW5kZXJlZCByYW5nZS5cbiAgX3N0YXJ0SW5kZXg6IG51bWJlclxuICBfc3RvcEluZGV4OiBudW1iZXJcbiAgX3JlZnM6IFN1YmplY3Q8P0hUTUxFbGVtZW50PlxuICBfaGVpZ2h0czogRGVmYXVsdFdlYWtNYXA8UmVjb3JkLCBudW1iZXI+ID0gbmV3IERlZmF1bHRXZWFrTWFwKCgpID0+IElOSVRJQUxfUkVDT1JEX0hFSUdIVClcbiAgLy8gRXhwcmVzc2lvblRyZWVDb21wb25lbnQgZXhwZWN0cyBhbiBleHBhbnNpb25TdGF0ZUlkIHdoaWNoIGlzIGEgc3RhYmxlXG4gIC8vIG9iamVjdCBpbnN0YW5jZSBhY3Jvc3MgcmVuZGVycywgYnV0IGlzIHVuaXF1ZSBhY3Jvc3MgY29uc29sZXMuIFdlXG4gIC8vIHRlY2huaWNhbGx5IHN1cHBvcnQgbXVsdGlwbGUgY29uc29sZXMgaW4gdGhlIFVJLCBzbyBoZXJlIHdlIGVuc3VyZSB0aGVzZVxuICAvLyByZWZlcmVuY2VzIGFyZSBsb2NhbCB0byB0aGUgT3V0cHV0VGFibGUgaW5zdGFuY2UuXG4gIF9leHBhbnNpb25TdGF0ZUlkczogRGVmYXVsdFdlYWtNYXA8UmVjb3JkLCBPYmplY3Q+ID0gbmV3IERlZmF1bHRXZWFrTWFwKCgpID0+ICh7fSkpXG4gIF9oZWlnaHRDaGFuZ2VzOiBTdWJqZWN0PG51bGw+ID0gbmV3IFN1YmplY3QoKVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzOiBQcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuX2Rpc3Bvc2FibGUgPSBuZXcgVW5pdmVyc2FsRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5faGFzaGVyID0gbmV3IEhhc2hlcigpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwLFxuICAgIH1cbiAgICB0aGlzLl9zdGFydEluZGV4ID0gMFxuICAgIHRoaXMuX3N0b3BJbmRleCA9IDBcbiAgICB0aGlzLl9yZWZzID0gbmV3IFN1YmplY3QoKVxuICAgIHRoaXMuX2Rpc3Bvc2FibGUuYWRkKFxuICAgICAgdGhpcy5faGVpZ2h0Q2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAvLyBUaGVvcmV0aWNhbGx5IHdlIHNob3VsZCBiZSBhYmxlIHRvICh0cmFpbGluZykgdGhyb3R0bGUgdGhpcyB0byBvbmNlXG4gICAgICAgIC8vIHBlciByZW5kZXIvcGFpbnQgdXNpbmcgbWljcm90YXNrLCBidXQgSSBoYXZlbid0IGJlZW4gYWJsZSB0byBnZXQgaXRcbiAgICAgICAgLy8gdG8gd29yayB3aXRob3V0IHNlZWluZyB2aXNpYmxlIGZsYXNoZXMgb2YgY29sbGFwc2VkIG91dHB1dC5cbiAgICAgICAgdGhpcy5fcmVjb21wdXRlUm93SGVpZ2h0cygpXG4gICAgICB9KSxcbiAgICAgIHRoaXMuX3JlZnNcbiAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAuc3dpdGNoTWFwKChub2RlKSA9PiBuZXcgUmVzaXplT2JzZXJ2YWJsZShudWxsVGhyb3dzKG5vZGUpKS5tYXBUbyhub2RlKSlcbiAgICAgICAgLnN1YnNjcmliZSgobm9kZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgb2Zmc2V0SGVpZ2h0LCBvZmZzZXRXaWR0aCB9ID0gbnVsbFRocm93cyhub2RlKVxuICAgICAgICAgIHRoaXMuX2hhbmRsZVJlc2l6ZShvZmZzZXRIZWlnaHQsIG9mZnNldFdpZHRoKVxuICAgICAgICB9KVxuICAgIClcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHM6IFByb3BzLCBwcmV2U3RhdGU6IFN0YXRlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2xpc3QgIT0gbnVsbCAmJiByZWNvcmRzQ2hhbmdlZChwcmV2UHJvcHMucmVjb3JkcywgdGhpcy5wcm9wcy5yZWNvcmRzKSkge1xuICAgICAgLy8gJEZsb3dJZ25vcmUgVW50eXBlZCByZWFjdC12aXJ0dWFsaXplZCBMaXN0IG1ldGhvZFxuICAgICAgdGhpcy5fbGlzdC5yZWNvbXB1dGVSb3dIZWlnaHRzKClcbiAgICB9XG4gICAgaWYgKHByZXZQcm9wcy5mb250U2l6ZSAhPT0gdGhpcy5wcm9wcy5mb250U2l6ZSkge1xuICAgICAgdGhpcy5fcmVuZGVyZWRSZWNvcmRzLmZvckVhY2goKHJlY29yZFZpZXcpID0+IHJlY29yZFZpZXcubWVhc3VyZUFuZE5vdGlmeUhlaWdodCgpKVxuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuX2Rpc3Bvc2FibGUuZGlzcG9zZSgpXG4gIH1cblxuICBfaGFuZGxlUmVmID0gKG5vZGU6ID9IVE1MRWxlbWVudCkgPT4ge1xuICAgIHRoaXMuX3JlZnMubmV4dChub2RlKVxuICB9XG5cbiAgcmVuZGVyKCk6IFJlYWN0Lk5vZGUge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnNvbGUtdGFibGUtd3JhcHBlclwiIHJlZj17dGhpcy5faGFuZGxlUmVmfSB0YWJJbmRleD1cIjFcIj5cbiAgICAgICAge3RoaXMuX2NvbnRhaW5lclJlbmRlcmVkKCkgPyAoXG4gICAgICAgICAgPExpc3RcbiAgICAgICAgICAgIC8vICRGbG93Rml4TWUoPj0wLjUzLjApIEZsb3cgc3VwcHJlc3NcbiAgICAgICAgICAgIHJlZj17dGhpcy5faGFuZGxlTGlzdFJlZn1cbiAgICAgICAgICAgIGhlaWdodD17dGhpcy5zdGF0ZS5oZWlnaHR9XG4gICAgICAgICAgICB3aWR0aD17dGhpcy5zdGF0ZS53aWR0aH1cbiAgICAgICAgICAgIHJvd0NvdW50PXt0aGlzLnByb3BzLnJlY29yZHMubGVuZ3RofVxuICAgICAgICAgICAgcm93SGVpZ2h0PXt0aGlzLl9nZXRSb3dIZWlnaHR9XG4gICAgICAgICAgICByb3dSZW5kZXJlcj17dGhpcy5fcmVuZGVyUm93fVxuICAgICAgICAgICAgb3ZlcnNjYW5Sb3dDb3VudD17T1ZFUlNDQU5fQ09VTlR9XG4gICAgICAgICAgICBvblNjcm9sbD17dGhpcy5fb25TY3JvbGx9XG4gICAgICAgICAgICBvblJvd3NSZW5kZXJlZD17dGhpcy5faGFuZGxlTGlzdFJlbmRlcn1cbiAgICAgICAgICAvPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIF9yZWNvbXB1dGVSb3dIZWlnaHRzID0gKCkgPT4ge1xuICAgIC8vIFRoZSByZWFjdC12aXJ0dWFsaXplZCBMaXN0IGNvbXBvbmVudCBpcyBwcm92aWRlZCB0aGUgcm93IGhlaWdodHNcbiAgICAvLyB0aHJvdWdoIGEgZnVuY3Rpb24sIHNvIGl0IGhhcyBubyB3YXkgb2Yga25vd2luZyB0aGF0IGEgcm93J3MgaGVpZ2h0XG4gICAgLy8gaGFzIGNoYW5nZWQgdW5sZXNzIHdlIGV4cGxpY2l0bHkgbm90aWZ5IGl0IHRvIHJlY29tcHV0ZSB0aGUgaGVpZ2h0cy5cbiAgICBpZiAodGhpcy5fbGlzdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgLy8gJEZsb3dJZ25vcmUgVW50eXBlZCByZWFjdC12aXJ0dWFsaXplZCBMaXN0IGNvbXBvbmVudCBtZXRob2RcbiAgICB0aGlzLl9saXN0LnJlY29tcHV0ZVJvd0hlaWdodHMoKVxuXG4gICAgLy8gSWYgd2UgYXJlIGFscmVhZHkgc2Nyb2xsZWQgdG8gdGhlIGJvdHRvbSwgc2Nyb2xsIHRvIGVuc3VyZSB0aGF0IHRoZSBzY3JvbGxiYXIgcmVtYWlucyBhdFxuICAgIC8vIHRoZSBib3R0b20uIFRoaXMgaXMgaW1wb3J0YW50IG5vdCBqdXN0IGZvciBpZiB0aGUgbGFzdCByZWNvcmQgY2hhbmdlcyBoZWlnaHQgdGhyb3VnaCB1c2VyXG4gICAgLy8gaW50ZXJhY3Rpb24gKGUuZy4gZXhwYW5kaW5nIGEgZGVidWdnZXIgdmFyaWFibGUpLCBidXQgYWxzbyBiZWNhdXNlIHRoaXMgaXMgdGhlIG1lY2hhbmlzbVxuICAgIC8vIHRocm91Z2ggd2hpY2ggdGhlIHJlY29yZCdzIHRydWUgaW5pdGlhbCBoZWlnaHQgaXMgcmVwb3J0ZWQuIFRoZXJlZm9yZSwgd2UgbWF5IGhhdmUgc2Nyb2xsZWRcbiAgICAvLyB0byB0aGUgYm90dG9tLCBhbmQgb25seSBhZnRlcndhcmRzIHJlY2VpdmVkIGl0cyB0cnVlIGhlaWdodC4gSW4gdGhpcyBjYXNlLCBpdCdzIGltcG9ydGFudFxuICAgIC8vIHRoYXQgd2UgdGhlbiBzY3JvbGwgdG8gdGhlIG5ldyBib3R0b20uXG4gICAgaWYgKHRoaXMucHJvcHMuc2hvdWxkU2Nyb2xsVG9Cb3R0b20oKSkge1xuICAgICAgdGhpcy5zY3JvbGxUb0JvdHRvbSgpXG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUxpc3RSZW5kZXIgPSAob3B0czogeyBzdGFydEluZGV4OiBudW1iZXIsIHN0b3BJbmRleDogbnVtYmVyIH0pOiB2b2lkID0+IHtcbiAgICB0aGlzLl9zdGFydEluZGV4ID0gb3B0cy5zdGFydEluZGV4XG4gICAgdGhpcy5fc3RvcEluZGV4ID0gb3B0cy5zdG9wSW5kZXhcbiAgfVxuXG4gIHNjcm9sbFRvQm90dG9tKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9saXN0ICE9IG51bGwpIHtcbiAgICAgIC8vICRGbG93SWdub3JlIFVudHlwZWQgcmVhY3QtdmlydHVhbGl6ZWQgTGlzdCBtZXRob2RcbiAgICAgIHRoaXMuX2xpc3Quc2Nyb2xsVG9Sb3codGhpcy5wcm9wcy5yZWNvcmRzLmxlbmd0aCAtIDEpXG4gICAgfVxuICB9XG5cbiAgX2dldEV4ZWN1dG9yID0gKGlkOiBzdHJpbmcpOiA/RXhlY3V0b3IgPT4ge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmdldEV4ZWN1dG9yKGlkKVxuICB9XG5cbiAgX2dldFByb3ZpZGVyID0gKGlkOiBzdHJpbmcpOiA/U291cmNlSW5mbyA9PiB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMuZ2V0UHJvdmlkZXIoaWQpXG4gIH1cblxuICBfcmVuZGVyUm93ID0gKHJvd01ldGFkYXRhOiBSb3dSZW5kZXJlclBhcmFtcyk6IFJlYWN0LkVsZW1lbnQ8YW55PiA9PiB7XG4gICAgY29uc3QgeyBpbmRleCwgc3R5bGUgfSA9IHJvd01ldGFkYXRhXG4gICAgY29uc3QgcmVjb3JkID0gdGhpcy5wcm9wcy5yZWNvcmRzW2luZGV4XVxuICAgIGNvbnN0IGtleSA9XG4gICAgICByZWNvcmQubWVzc2FnZUlkICE9IG51bGwgPyBgbWVzc2FnZUlkOiR7cmVjb3JkLm1lc3NhZ2VJZH1gIDogYHJlY29yZEhhc2g6JHt0aGlzLl9oYXNoZXIuZ2V0SGFzaChyZWNvcmQpfWBcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGtleT17a2V5fSBjbGFzc05hbWU9XCJjb25zb2xlLXRhYmxlLXJvdy13cmFwcGVyXCIgc3R5bGU9e3N0eWxlfT5cbiAgICAgICAgPFJlY29yZFZpZXdcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbnVjbGlkZS1pbnRlcm5hbC9qc3gtc2ltcGxlLWNhbGxiYWNrLXJlZnNcbiAgICAgICAgICByZWY9eyh2aWV3OiA/UmVjb3JkVmlldykgPT4ge1xuICAgICAgICAgICAgaWYgKHZpZXcgIT0gbnVsbCkge1xuICAgICAgICAgICAgICB0aGlzLl9yZW5kZXJlZFJlY29yZHMuc2V0KHJlY29yZCwgdmlldylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuX3JlbmRlcmVkUmVjb3Jkcy5kZWxldGUocmVjb3JkKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgZ2V0RXhlY3V0b3I9e3RoaXMuX2dldEV4ZWN1dG9yfVxuICAgICAgICAgIGdldFByb3ZpZGVyPXt0aGlzLl9nZXRQcm92aWRlcn1cbiAgICAgICAgICByZWNvcmQ9e3JlY29yZH1cbiAgICAgICAgICBleHBhbnNpb25TdGF0ZUlkPXt0aGlzLl9leHBhbnNpb25TdGF0ZUlkcy5nZXQocmVjb3JkKX1cbiAgICAgICAgICBzaG93U291cmNlTGFiZWw9e3RoaXMucHJvcHMuc2hvd1NvdXJjZUxhYmVsc31cbiAgICAgICAgICBvbkhlaWdodENoYW5nZT17dGhpcy5faGFuZGxlUmVjb3JkSGVpZ2h0Q2hhbmdlfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgX2NvbnRhaW5lclJlbmRlcmVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLndpZHRoICE9PSAwICYmIHRoaXMuc3RhdGUuaGVpZ2h0ICE9PSAwXG4gIH1cblxuICBfZ2V0Um93SGVpZ2h0ID0gKHsgaW5kZXggfTogUm93SGVpZ2h0UGFyYW1zKTogbnVtYmVyID0+IHtcbiAgICByZXR1cm4gdGhpcy5faGVpZ2h0cy5nZXQodGhpcy5wcm9wcy5yZWNvcmRzW2luZGV4XSlcbiAgfVxuXG4gIF9oYW5kbGVUYWJsZVdyYXBwZXIgPSAodGFibGVXcmFwcGVyOiBIVE1MRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuX3dyYXBwZXIgPSB0YWJsZVdyYXBwZXJcbiAgfVxuXG4gIF9oYW5kbGVMaXN0UmVmID0gKGxpc3RSZWY6IFJlYWN0LkVsZW1lbnQ8YW55Pik6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHByZXZpb3VzVmFsdWUgPSB0aGlzLl9saXN0XG4gICAgdGhpcy5fbGlzdCA9IGxpc3RSZWZcblxuICAgIC8vIFRoZSBjaGlsZCByb3dzIHJlbmRlciBiZWZvcmUgdGhpcyByZWYgZ2V0cyBzZXQuIFNvLCBpZiB3ZSBhcmUgY29taW5nIGZyb21cbiAgICAvLyBhIHN0YXRlIHdoZXJlIHRoZSByZWYgd2FzIG51bGwsIHdlIHNob3VsZCBlbnN1cmUgd2Ugbm90aWZ5XG4gICAgLy8gcmVhY3QtdmlydHVhbGl6ZWQgdGhhdCB3ZSBoYXZlIG1lYXN1cmVtZW50cy5cbiAgICBpZiAocHJldmlvdXNWYWx1ZSA9PSBudWxsICYmIHRoaXMuX2xpc3QgIT0gbnVsbCkge1xuICAgICAgdGhpcy5faGVpZ2h0Q2hhbmdlcy5uZXh0KG51bGwpXG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZVJlc2l6ZSA9IChoZWlnaHQ6IG51bWJlciwgd2lkdGg6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGlmIChoZWlnaHQgPT09IHRoaXMuc3RhdGUuaGVpZ2h0ICYmIHdpZHRoID09PSB0aGlzLnN0YXRlLndpZHRoKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICB9KVxuXG4gICAgLy8gV2hlbiB0aGlzIGNvbXBvbmVudCByZXNpemVzLCB0aGUgaW5uZXIgcmVjb3JkcyB3aWxsXG4gICAgLy8gYWxzbyByZXNpemUgYW5kIHBvdGVudGlhbGx5IGhhdmUgdGhlaXIgaGVpZ2h0cyBjaGFuZ2VcbiAgICAvLyBTbyB3ZSBtZWFzdXJlIGFsbCBvZiB0aGVpciBoZWlnaHRzIGFnYWluIGhlcmVcbiAgICB0aGlzLl9yZW5kZXJlZFJlY29yZHMuZm9yRWFjaCgocmVjb3JkVmlldykgPT4gcmVjb3JkVmlldy5tZWFzdXJlQW5kTm90aWZ5SGVpZ2h0KCkpXG4gIH1cblxuICBfaGFuZGxlUmVjb3JkSGVpZ2h0Q2hhbmdlID0gKHJlY29yZDogUmVjb3JkLCBuZXdIZWlnaHQ6IG51bWJlcik6IHZvaWQgPT4ge1xuICAgIGNvbnN0IG9sZEhlaWdodCA9IHRoaXMuX2hlaWdodHMuZ2V0KHJlY29yZClcbiAgICBpZiAob2xkSGVpZ2h0ICE9PSBuZXdIZWlnaHQpIHtcbiAgICAgIHRoaXMuX2hlaWdodHMuc2V0KHJlY29yZCwgbmV3SGVpZ2h0KVxuICAgICAgdGhpcy5faGVpZ2h0Q2hhbmdlcy5uZXh0KG51bGwpXG4gICAgfVxuICB9XG5cbiAgX29uU2Nyb2xsID0gKHsgY2xpZW50SGVpZ2h0LCBzY3JvbGxIZWlnaHQsIHNjcm9sbFRvcCB9OiBPblNjcm9sbFBhcmFtcyk6IHZvaWQgPT4ge1xuICAgIHRoaXMucHJvcHMub25TY3JvbGwoY2xpZW50SGVpZ2h0LCBzY3JvbGxIZWlnaHQsIHNjcm9sbFRvcClcbiAgfVxufVxuIl19
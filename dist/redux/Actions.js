"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearRecords = clearRecords;
exports.recordReceived = recordReceived;
exports.recordUpdated = recordUpdated;
exports.registerExecutor = registerExecutor;
exports.execute = execute;
exports.registerRecordProvider = registerRecordProvider;
exports.registerSource = registerSource;
exports.unregisterRecordProvider = unregisterRecordProvider;
exports.selectExecutor = selectExecutor;
exports.setMaxMessageCount = setMaxMessageCount;
exports.removeSource = removeSource;
exports.unregisterExecutor = unregisterExecutor;
exports.updateStatus = updateStatus;
exports.setCreatePasteFunction = setCreatePasteFunction;
exports.setWatchEditor = setWatchEditor;
exports.setFontSize = setFontSize;
exports.SET_FONT_SIZE = exports.UPDATE_STATUS = exports.REMOVE_SOURCE = exports.REGISTER_SOURCE = exports.RECORD_UPDATED = exports.RECORD_RECEIVED = exports.SET_MAX_MESSAGE_COUNT = exports.SELECT_EXECUTOR = exports.REGISTER_RECORD_PROVIDER = exports.EXECUTE = exports.REGISTER_EXECUTOR = exports.SET_WATCH_EDITOR_FUNCTION = exports.SET_CREATE_PASTE_FUNCTION = exports.CLEAR_RECORDS = void 0;

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 * @format
 */
const CLEAR_RECORDS = 'CLEAR_RECORDS';
exports.CLEAR_RECORDS = CLEAR_RECORDS;
const SET_CREATE_PASTE_FUNCTION = 'SET_CREATE_PASTE_FUNCTION';
exports.SET_CREATE_PASTE_FUNCTION = SET_CREATE_PASTE_FUNCTION;
const SET_WATCH_EDITOR_FUNCTION = 'SET_WATCH_EDITOR_FUNCTION';
exports.SET_WATCH_EDITOR_FUNCTION = SET_WATCH_EDITOR_FUNCTION;
const REGISTER_EXECUTOR = 'REGISTER_EXECUTOR';
exports.REGISTER_EXECUTOR = REGISTER_EXECUTOR;
const EXECUTE = 'EXECUTE';
exports.EXECUTE = EXECUTE;
const REGISTER_RECORD_PROVIDER = 'REGISTER_RECORD_PROVIDER';
exports.REGISTER_RECORD_PROVIDER = REGISTER_RECORD_PROVIDER;
const SELECT_EXECUTOR = 'SELECT_EXECUTOR';
exports.SELECT_EXECUTOR = SELECT_EXECUTOR;
const SET_MAX_MESSAGE_COUNT = 'SET_MAX_MESSAGE_COUNT';
exports.SET_MAX_MESSAGE_COUNT = SET_MAX_MESSAGE_COUNT;
const RECORD_RECEIVED = 'RECORD_RECEIVED';
exports.RECORD_RECEIVED = RECORD_RECEIVED;
const RECORD_UPDATED = 'RECORD_UPDATED';
exports.RECORD_UPDATED = RECORD_UPDATED;
const REGISTER_SOURCE = 'REGISTER_SOURCE';
exports.REGISTER_SOURCE = REGISTER_SOURCE;
const REMOVE_SOURCE = 'REMOVE_SOURCE';
exports.REMOVE_SOURCE = REMOVE_SOURCE;
const UPDATE_STATUS = 'UPDATE_STATUS';
exports.UPDATE_STATUS = UPDATE_STATUS;
const SET_FONT_SIZE = 'SET_FONT_SIZE';
exports.SET_FONT_SIZE = SET_FONT_SIZE;

function clearRecords() {
  return {
    type: CLEAR_RECORDS
  };
}

function recordReceived(record) {
  return {
    type: RECORD_RECEIVED,
    payload: {
      record
    }
  };
}

function recordUpdated(messageId, appendText, overrideLevel, setComplete) {
  return {
    type: RECORD_UPDATED,
    payload: {
      messageId,
      appendText,
      overrideLevel,
      setComplete
    }
  };
}

function registerExecutor(executor) {
  return {
    type: REGISTER_EXECUTOR,
    payload: {
      executor
    }
  };
}

function execute(code) {
  return {
    type: EXECUTE,
    payload: {
      code
    }
  };
}

function registerRecordProvider(recordProvider) {
  return {
    type: REGISTER_RECORD_PROVIDER,
    payload: {
      recordProvider
    }
  };
}

function registerSource(source) {
  return {
    type: REGISTER_SOURCE,
    payload: {
      source
    }
  };
}

function unregisterRecordProvider(recordProvider) {
  return removeSource(recordProvider.id);
}

function selectExecutor(executorId) {
  return {
    type: SELECT_EXECUTOR,
    payload: {
      executorId
    }
  };
}

function setMaxMessageCount(maxMessageCount) {
  return {
    type: SET_MAX_MESSAGE_COUNT,
    payload: {
      maxMessageCount
    }
  };
}

function removeSource(sourceId) {
  return {
    type: REMOVE_SOURCE,
    payload: {
      sourceId
    }
  };
}

function unregisterExecutor(executor) {
  return removeSource(executor.id);
}

function updateStatus(providerId, status) {
  return {
    type: UPDATE_STATUS,
    payload: {
      providerId,
      status
    }
  };
}

function setCreatePasteFunction(createPasteFunction) {
  return {
    type: SET_CREATE_PASTE_FUNCTION,
    payload: {
      createPasteFunction
    }
  };
}

function setWatchEditor(watchEditor) {
  return {
    type: SET_WATCH_EDITOR_FUNCTION,
    payload: {
      watchEditor
    }
  };
}

function setFontSize(fontSize) {
  return {
    type: SET_FONT_SIZE,
    payload: {
      fontSize
    }
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFjdGlvbnMuanMiXSwibmFtZXMiOlsiQ0xFQVJfUkVDT1JEUyIsIlNFVF9DUkVBVEVfUEFTVEVfRlVOQ1RJT04iLCJTRVRfV0FUQ0hfRURJVE9SX0ZVTkNUSU9OIiwiUkVHSVNURVJfRVhFQ1VUT1IiLCJFWEVDVVRFIiwiUkVHSVNURVJfUkVDT1JEX1BST1ZJREVSIiwiU0VMRUNUX0VYRUNVVE9SIiwiU0VUX01BWF9NRVNTQUdFX0NPVU5UIiwiUkVDT1JEX1JFQ0VJVkVEIiwiUkVDT1JEX1VQREFURUQiLCJSRUdJU1RFUl9TT1VSQ0UiLCJSRU1PVkVfU09VUkNFIiwiVVBEQVRFX1NUQVRVUyIsIlNFVF9GT05UX1NJWkUiLCJjbGVhclJlY29yZHMiLCJ0eXBlIiwicmVjb3JkUmVjZWl2ZWQiLCJyZWNvcmQiLCJwYXlsb2FkIiwicmVjb3JkVXBkYXRlZCIsIm1lc3NhZ2VJZCIsImFwcGVuZFRleHQiLCJvdmVycmlkZUxldmVsIiwic2V0Q29tcGxldGUiLCJyZWdpc3RlckV4ZWN1dG9yIiwiZXhlY3V0b3IiLCJleGVjdXRlIiwiY29kZSIsInJlZ2lzdGVyUmVjb3JkUHJvdmlkZXIiLCJyZWNvcmRQcm92aWRlciIsInJlZ2lzdGVyU291cmNlIiwic291cmNlIiwidW5yZWdpc3RlclJlY29yZFByb3ZpZGVyIiwicmVtb3ZlU291cmNlIiwiaWQiLCJzZWxlY3RFeGVjdXRvciIsImV4ZWN1dG9ySWQiLCJzZXRNYXhNZXNzYWdlQ291bnQiLCJtYXhNZXNzYWdlQ291bnQiLCJzb3VyY2VJZCIsInVucmVnaXN0ZXJFeGVjdXRvciIsInVwZGF0ZVN0YXR1cyIsInByb3ZpZGVySWQiLCJzdGF0dXMiLCJzZXRDcmVhdGVQYXN0ZUZ1bmN0aW9uIiwiY3JlYXRlUGFzdGVGdW5jdGlvbiIsInNldFdhdGNoRWRpdG9yIiwid2F0Y2hFZGl0b3IiLCJzZXRGb250U2l6ZSIsImZvbnRTaXplIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFD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SSxFQUFFSixhQUREO0FBRUxPLElBQUFBLE9BQU8sRUFBRTtBQUFDcUIsTUFBQUE7QUFBRDtBQUZKLEdBQVA7QUFJRDs7QUFFTSxTQUFTQyxrQkFBVCxDQUE0QmYsUUFBNUIsRUFBd0Q7QUFDN0QsU0FBT1EsWUFBWSxDQUFDUixRQUFRLENBQUNTLEVBQVYsQ0FBbkI7QUFDRDs7QUFFTSxTQUFTTyxZQUFULENBQ0xDLFVBREssRUFFTEMsTUFGSyxFQUdHO0FBQ1IsU0FBTztBQUNMNUIsSUFBQUEsSUFBSSxFQUFFSCxhQUREO0FBRUxNLElBQUFBLE9BQU8sRUFBRTtBQUFDd0IsTUFBQUEsVUFBRDtBQUFhQyxNQUFBQTtBQUFiO0FBRkosR0FBUDtBQUlEOztBQUVNLFNBQVNDLHNCQUFULENBQ0xDLG1CQURLLEVBRUc7QUFDUixTQUFPO0FBQ0w5QixJQUFBQSxJQUFJLEVBQUVkLHlCQUREO0FBRUxpQixJQUFBQSxPQUFPLEVBQUU7QUFBQzJCLE1BQUFBO0FBQUQ7QUFGSixHQUFQO0FBSUQ7O0FBRU0sU0FBU0MsY0FBVCxDQUNMQyxXQURLLEVBRUc7QUFDUixTQUFPO0FBQ0xoQyxJQUFBQSxJQUFJLEVBQUViLHlCQUREO0FBRUxnQixJQUFBQSxPQUFPLEVBQUU7QUFBQzZCLE1BQUFBO0FBQUQ7QUFGSixHQUFQO0FBSUQ7O0FBRU0sU0FBU0MsV0FBVCxDQUFxQkMsUUFBckIsRUFBK0M7QUFDcEQsU0FBTztBQUNMbEMsSUFBQUEsSUFBSSxFQUFFRixhQUREO0FBRUxLLElBQUFBLE9BQU8sRUFBRTtBQUFDK0IsTUFBQUE7QUFBRDtBQUZKLEdBQVA7QUFJRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTctcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cclxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXHJcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxyXG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cclxuICpcclxuICogQGZsb3cgc3RyaWN0LWxvY2FsXHJcbiAqIEBmb3JtYXRcclxuICovXHJcblxyXG5pbXBvcnQgdHlwZSB7XHJcbiAgQWN0aW9uLFxyXG4gIEV4ZWN1dG9yLFxyXG4gIENvbnNvbGVTb3VyY2VTdGF0dXMsXHJcbiAgUmVjb3JkLFxyXG4gIFJlY29yZFByb3ZpZGVyLFxyXG4gIFNvdXJjZUluZm8sXHJcbiAgTGV2ZWwsXHJcbn0gZnJvbSAnLi4vdHlwZXMnO1xyXG5cclxuaW1wb3J0IHR5cGUge0NyZWF0ZVBhc3RlRnVuY3Rpb259IGZyb20gJy4uL3R5cGVzJztcclxuXHJcbmV4cG9ydCBjb25zdCBDTEVBUl9SRUNPUkRTID0gJ0NMRUFSX1JFQ09SRFMnO1xyXG5leHBvcnQgY29uc3QgU0VUX0NSRUFURV9QQVNURV9GVU5DVElPTiA9ICdTRVRfQ1JFQVRFX1BBU1RFX0ZVTkNUSU9OJztcclxuZXhwb3J0IGNvbnN0IFNFVF9XQVRDSF9FRElUT1JfRlVOQ1RJT04gPSAnU0VUX1dBVENIX0VESVRPUl9GVU5DVElPTic7XHJcbmV4cG9ydCBjb25zdCBSRUdJU1RFUl9FWEVDVVRPUiA9ICdSRUdJU1RFUl9FWEVDVVRPUic7XHJcbmV4cG9ydCBjb25zdCBFWEVDVVRFID0gJ0VYRUNVVEUnO1xyXG5leHBvcnQgY29uc3QgUkVHSVNURVJfUkVDT1JEX1BST1ZJREVSID0gJ1JFR0lTVEVSX1JFQ09SRF9QUk9WSURFUic7XHJcbmV4cG9ydCBjb25zdCBTRUxFQ1RfRVhFQ1VUT1IgPSAnU0VMRUNUX0VYRUNVVE9SJztcclxuZXhwb3J0IGNvbnN0IFNFVF9NQVhfTUVTU0FHRV9DT1VOVCA9ICdTRVRfTUFYX01FU1NBR0VfQ09VTlQnO1xyXG5leHBvcnQgY29uc3QgUkVDT1JEX1JFQ0VJVkVEID0gJ1JFQ09SRF9SRUNFSVZFRCc7XHJcbmV4cG9ydCBjb25zdCBSRUNPUkRfVVBEQVRFRCA9ICdSRUNPUkRfVVBEQVRFRCc7XHJcbmV4cG9ydCBjb25zdCBSRUdJU1RFUl9TT1VSQ0UgPSAnUkVHSVNURVJfU09VUkNFJztcclxuZXhwb3J0IGNvbnN0IFJFTU9WRV9TT1VSQ0UgPSAnUkVNT1ZFX1NPVVJDRSc7XHJcbmV4cG9ydCBjb25zdCBVUERBVEVfU1RBVFVTID0gJ1VQREFURV9TVEFUVVMnO1xyXG5leHBvcnQgY29uc3QgU0VUX0ZPTlRfU0laRSA9ICdTRVRfRk9OVF9TSVpFJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGVhclJlY29yZHMoKTogQWN0aW9uIHtcclxuICByZXR1cm4ge3R5cGU6IENMRUFSX1JFQ09SRFN9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjb3JkUmVjZWl2ZWQocmVjb3JkOiBSZWNvcmQpOiBBY3Rpb24ge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBSRUNPUkRfUkVDRUlWRUQsXHJcbiAgICBwYXlsb2FkOiB7cmVjb3JkfSxcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVjb3JkVXBkYXRlZChcclxuICBtZXNzYWdlSWQ6IHN0cmluZyxcclxuICBhcHBlbmRUZXh0OiA/c3RyaW5nLFxyXG4gIG92ZXJyaWRlTGV2ZWw6ID9MZXZlbCxcclxuICBzZXRDb21wbGV0ZTogYm9vbGVhbixcclxuKTogQWN0aW9uIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogUkVDT1JEX1VQREFURUQsXHJcbiAgICBwYXlsb2FkOiB7bWVzc2FnZUlkLCBhcHBlbmRUZXh0LCBvdmVycmlkZUxldmVsLCBzZXRDb21wbGV0ZX0sXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyRXhlY3V0b3IoZXhlY3V0b3I6IEV4ZWN1dG9yKTogQWN0aW9uIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogUkVHSVNURVJfRVhFQ1VUT1IsXHJcbiAgICBwYXlsb2FkOiB7ZXhlY3V0b3J9LFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKGNvZGU6IHN0cmluZyk6IEFjdGlvbiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IEVYRUNVVEUsXHJcbiAgICBwYXlsb2FkOiB7Y29kZX0sXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyUmVjb3JkUHJvdmlkZXIocmVjb3JkUHJvdmlkZXI6IFJlY29yZFByb3ZpZGVyKTogQWN0aW9uIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogUkVHSVNURVJfUkVDT1JEX1BST1ZJREVSLFxyXG4gICAgcGF5bG9hZDoge3JlY29yZFByb3ZpZGVyfSxcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJTb3VyY2Uoc291cmNlOiBTb3VyY2VJbmZvKTogQWN0aW9uIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogUkVHSVNURVJfU09VUkNFLFxyXG4gICAgcGF5bG9hZDoge3NvdXJjZX0sXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVucmVnaXN0ZXJSZWNvcmRQcm92aWRlcihcclxuICByZWNvcmRQcm92aWRlcjogUmVjb3JkUHJvdmlkZXIsXHJcbik6IEFjdGlvbiB7XHJcbiAgcmV0dXJuIHJlbW92ZVNvdXJjZShyZWNvcmRQcm92aWRlci5pZCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RFeGVjdXRvcihleGVjdXRvcklkOiBzdHJpbmcpOiBBY3Rpb24ge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBTRUxFQ1RfRVhFQ1VUT1IsXHJcbiAgICBwYXlsb2FkOiB7ZXhlY3V0b3JJZH0sXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldE1heE1lc3NhZ2VDb3VudChtYXhNZXNzYWdlQ291bnQ6IG51bWJlcik6IEFjdGlvbiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IFNFVF9NQVhfTUVTU0FHRV9DT1VOVCxcclxuICAgIHBheWxvYWQ6IHttYXhNZXNzYWdlQ291bnR9LFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTb3VyY2Uoc291cmNlSWQ6IHN0cmluZyk6IEFjdGlvbiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IFJFTU9WRV9TT1VSQ0UsXHJcbiAgICBwYXlsb2FkOiB7c291cmNlSWR9LFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1bnJlZ2lzdGVyRXhlY3V0b3IoZXhlY3V0b3I6IEV4ZWN1dG9yKTogQWN0aW9uIHtcclxuICByZXR1cm4gcmVtb3ZlU291cmNlKGV4ZWN1dG9yLmlkKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVN0YXR1cyhcclxuICBwcm92aWRlcklkOiBzdHJpbmcsXHJcbiAgc3RhdHVzOiBDb25zb2xlU291cmNlU3RhdHVzLFxyXG4pOiBBY3Rpb24ge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBVUERBVEVfU1RBVFVTLFxyXG4gICAgcGF5bG9hZDoge3Byb3ZpZGVySWQsIHN0YXR1c30sXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldENyZWF0ZVBhc3RlRnVuY3Rpb24oXHJcbiAgY3JlYXRlUGFzdGVGdW5jdGlvbjogP0NyZWF0ZVBhc3RlRnVuY3Rpb24sXHJcbik6IEFjdGlvbiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IFNFVF9DUkVBVEVfUEFTVEVfRlVOQ1RJT04sXHJcbiAgICBwYXlsb2FkOiB7Y3JlYXRlUGFzdGVGdW5jdGlvbn0sXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFdhdGNoRWRpdG9yKFxyXG4gIHdhdGNoRWRpdG9yOiA/YXRvbSRBdXRvY29tcGxldGVXYXRjaEVkaXRvcixcclxuKTogQWN0aW9uIHtcclxuICByZXR1cm4ge1xyXG4gICAgdHlwZTogU0VUX1dBVENIX0VESVRPUl9GVU5DVElPTixcclxuICAgIHBheWxvYWQ6IHt3YXRjaEVkaXRvcn0sXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldEZvbnRTaXplKGZvbnRTaXplOiBudW1iZXIpOiBBY3Rpb24ge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBTRVRfRk9OVF9TSVpFLFxyXG4gICAgcGF5bG9hZDoge2ZvbnRTaXplfSxcclxuICB9O1xyXG59XHJcbiJdfQ==
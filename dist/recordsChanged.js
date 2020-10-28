"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = recordsChanged;

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

/**
 * Check to see if the records have changed. This is optimized to take advantage of the knowledge
 * knowledge that record lists are only ever appended.
 */
function recordsChanged(a, b) {
  return a.length !== b.length || last(a) !== last(b);
}

const last = arr => arr[arr.length - 1];

module.exports = exports.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlY29yZHNDaGFuZ2VkLmpzIl0sIm5hbWVzIjpbInJlY29yZHNDaGFuZ2VkIiwiYSIsImIiLCJsZW5ndGgiLCJsYXN0IiwiYXJyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUVlLFNBQVNBLGNBQVQsQ0FDYkMsQ0FEYSxFQUViQyxDQUZhLEVBR0o7QUFDVCxTQUFPRCxDQUFDLENBQUNFLE1BQUYsS0FBYUQsQ0FBQyxDQUFDQyxNQUFmLElBQXlCQyxJQUFJLENBQUNILENBQUQsQ0FBSixLQUFZRyxJQUFJLENBQUNGLENBQUQsQ0FBaEQ7QUFDRDs7QUFFRCxNQUFNRSxJQUFJLEdBQUdDLEdBQUcsSUFBSUEsR0FBRyxDQUFDQSxHQUFHLENBQUNGLE1BQUosR0FBYSxDQUFkLENBQXZCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENvcHlyaWdodCAoYykgMjAxNy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxyXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcclxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XHJcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxyXG4gKlxyXG4gKiBAZmxvdyBzdHJpY3QtbG9jYWxcclxuICogQGZvcm1hdFxyXG4gKi9cclxuXHJcbmltcG9ydCB0eXBlIHtSZWNvcmR9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuLyoqXHJcbiAqIENoZWNrIHRvIHNlZSBpZiB0aGUgcmVjb3JkcyBoYXZlIGNoYW5nZWQuIFRoaXMgaXMgb3B0aW1pemVkIHRvIHRha2UgYWR2YW50YWdlIG9mIHRoZSBrbm93bGVkZ2VcclxuICoga25vd2xlZGdlIHRoYXQgcmVjb3JkIGxpc3RzIGFyZSBvbmx5IGV2ZXIgYXBwZW5kZWQuXHJcbiAqL1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVjb3Jkc0NoYW5nZWQoXHJcbiAgYTogQXJyYXk8UmVjb3JkPixcclxuICBiOiBBcnJheTxSZWNvcmQ+LFxyXG4pOiBib29sZWFuIHtcclxuICByZXR1cm4gYS5sZW5ndGggIT09IGIubGVuZ3RoIHx8IGxhc3QoYSkgIT09IGxhc3QoYik7XHJcbn1cclxuXHJcbmNvbnN0IGxhc3QgPSBhcnIgPT4gYXJyW2Fyci5sZW5ndGggLSAxXTtcclxuIl19
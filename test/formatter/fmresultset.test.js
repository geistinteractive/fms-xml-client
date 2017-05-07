"use strict";
/**
 * Created by toddgeist on 12/6/16.
 */

const assert = require("assert");

const fmresultset = require("../../src/fms-request/fmresultset");
const fs = require("fs");

describe.only("fmresultset converter", function() {
  describe("when given the dbnames query result", function() {
    const xml = fs.readFileSync(
      __dirname + "/../fixtures/fmresultset-dbnames.xml"
    );

    const convertToJSON = fmresultset(xml);

    it("should get errorCode === 0", function() {
      return convertToJSON.then(json => {
        return assert(json.error.code === 0, "errorcode is 0");
      });
    });

    it("should get a record array with a length greater than 0", function() {
      return convertToJSON.then(json => {
        return assert(json.records.length > 0, "records is array");
      });
    });
  });

  describe("when given a findall xml", function() {
    const xml = fs.readFileSync(
      __dirname + "/../fixtures/fmresultset-findall.xml"
    );
    const convertToJSON = fmresultset(xml);
    it("should get records", function() {
      return convertToJSON.then(json => {
        return assert(json.records.length > 0, "records is array");
      });
    });

    it('should get a field "id" with auto enter true', function() {
      return convertToJSON.then(json => {
        const result = json.fields.id.autoEnter;
        return assert(result);
      });
    });
  });

  describe("when given xml with relatedSets", function() {
    const xml = fs.readFileSync(
      __dirname + "/../fixtures/fmresultset-related.xml"
    );

    it("should parse them correctly", function() {
      return fmresultset(xml).then(json => {
        assert(json.error.code === 0, "errorCode should be 0");

        const count = json.records[0].relatedSets[0].count;
        assert(count > 0, "count is great than zero");

        return json;
      });
    });
  });

  describe("when given a 954 error", function() {
    const xml = fs.readFileSync(
      __dirname + "/../fixtures/fmresultset-error954.xml"
    );
    const convertToJSON = fmresultset(xml);

    it("should return error 954", function() {
      return convertToJSON.then(json => {
        return assert(json.error.code === 954, "errorCode should be 954");
      });
    });
  });
});

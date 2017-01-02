import { ObjectFilter } from '../object-filter';
import * as chai from 'chai';
import 'mocha';

const expect = chai.expect;

describe('Filter expressions', () => {
    let objects = [
        { oid: 'o1', x: 1 },
        { oid: 'o2', x: 1 },
        { oid: 'o3', x: 2 },
    ];

    it('should filter by oid', () => {

        let predicate = ObjectFilter.getPredicate({ oid: 'o1' });
        let filtered = objects.filter(predicate);
        expect(filtered.length).to.be.equal(1);
        expect(filtered[0].oid).to.be.equal('o1');
    });

    it('should filter by prop', () => {
        let filtered = ObjectFilter.filter({ x: 1 }, objects);
        expect(filtered.length).to.be.equal(2);
        expect(ObjectFilter.filter({
            oid: { $in: ['o1', 'o2'] },
        }, filtered).length).to.be.equal(2);
    });
});

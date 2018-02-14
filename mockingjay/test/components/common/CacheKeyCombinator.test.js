const assert = require('assert')
const CachekeyCombinator = require('../../../src/components/common/CacheKeyCombinator')

describe('CachekeyCombinator', () => {
    describe('#combineCacheKey', () => {
        it('throw error when invoked without arguments', () => {
            try {
                CachekeyCombinator.combineCacheKey()
            } catch (error) {
                assert.equal(error, 'Error: cacheType is undefined or null')
            }
        })

        it('throw error when cacheType is not supported', () => {
            try {
                CachekeyCombinator.combineCacheKey('app')
            } catch (error) {
                assert.equal(error, 'Error: cacheType is not supported')
            }
        })

        it('return fix when pass a supported cacheType, but without params', () => {
            let prefix = CachekeyCombinator.combineCacheKey('apiId')
            let postfix = '_' + CachekeyCombinator.combineCacheKey('schema')
            assert.equal(true, 
                (CachekeyCombinator.keyPrefixes.apiId === prefix
                && CachekeyCombinator.keyPostfixes.schema === postfix)
            )
        })

        it('combine prefix and params(String)', ()=>{
            assert.equal('appinventory_app', 
                CachekeyCombinator.combineCacheKey('appDesc', 'app'))
        })

        it('combine prefix and params(Number)', ()=>{
            assert.equal('appinventory_1', 
                CachekeyCombinator.combineCacheKey('appDesc', '1'))
        })

        it('combine prefix and params(Array)', ()=>{
            assert.equal('appinventory_1_2_3', 
                CachekeyCombinator.combineCacheKey('appDesc', [1,2,3]))
        })

        it('combine prefix and params(Object)', ()=>{
            assert.equal('appinventory_1_2_3', 
                CachekeyCombinator.combineCacheKey('appDesc', 
                    {
                        one: 1,
                        two: 2,
                        three: 3
                    }
                )
            )
        })

        

    })
})
const assert = require('assert')
const CachekeyCombinator = require('../../src/common/CacheKeyCombinator')

describe('CachekeyCombinator', () => {
    describe('#buildAppCfgKey', () => {
        it('throw error when invoked without arguments', () => {
            try {
                CachekeyCombinator.buildAppCfgKey()
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
            let postfix = CachekeyCombinator.combineCacheKey('schema')
            assert.equal(true, 
                (CachekeyCombinator.keyPrefixes.apiId === prefix
                && 'apiinventory:_schema' === postfix)
            )
        })

        it('combine prefix and params(String)', ()=>{
            assert.equal('appinventory:1', 
                CachekeyCombinator.combineCacheKey('appDesc', '1'))
        })

        it('combine prefix and params(Number)', ()=>{
            assert.equal('appinventory:1', 
                CachekeyCombinator.combineCacheKey('appDesc', 1))
        })

        it('combine prefix and params(Array)', ()=>{
            assert.equal('appinventory:1', 
                CachekeyCombinator.combineCacheKey('appDesc', [1]))
        })

        it('combine prefix and params(Object)', ()=>{
            assert.equal('appinventory:1', 
                CachekeyCombinator.combineCacheKey('appDesc', 
                    {
                        one: 1
                    }
                )
            )
        })

        it('combine prefix and params(Array)', ()=>{
            assert.equal('apiinventory:1', 
                CachekeyCombinator.combineCacheKey('apiDesc', [1]))
        })

        it('combine prefix and params(Object)', ()=>{
            assert.equal('apiinventory:1', 
                CachekeyCombinator.combineCacheKey('apiDesc', 
                    {
                        one: 1
                    }
                )
            )
        })
        
        it('combine prefix-postfix and params(Array)', ()=>{
            assert.equal('apiinventory:test_1_schema', 
                CachekeyCombinator.combineCacheKey('schema', ['test', 1]))
        })

        it('combine prefix-postfix and params(Object)', ()=>{
            assert.equal('apiinventory:test_1_schema', 
                CachekeyCombinator.combineCacheKey('schema', 
                    {
                        app: 'test',
                        one: 1
                    }
                )
            )
        })
        
        it('combine prefix-postfix and params(Array)', ()=>{
            assert.equal('apiinventory:test_1_mockCfg', 
                CachekeyCombinator.combineCacheKey('mockCfg', ['test', 1]))
        })

        it('combine prefix-postfix and params(Object)', ()=>{
            assert.equal('apiinventory:test_1_mockCfg', 
                CachekeyCombinator.combineCacheKey('mockCfg', 
                    {
                        app: 'test',
                        one: 1
                    }
                )
            )
        })

    })
})
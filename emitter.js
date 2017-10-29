'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;
let throughtStartNumber = 0;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            let contexts = this.contexts || new Set();
            contexts.add(context);
            context[event] = handler.bind(context);

            return Object.assign(this, { contexts });
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            if (event.indexOf('.') > 0) {
                delete context[event];

                return this;
            }

            Object.keys(context)
                .filter(property => (typeof context[property] === 'function') &&
                    (property + '.').startsWith(event + '.'))
                .forEach(x => delete context[x]);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} eventToEmit
         * @returns {Object}
         */
        emit: function (eventToEmit) {
            let splitted = eventToEmit.split('.');
            let events = splitted.reduceRight(function (prev, current, i) {
                return prev.concat(splitted.slice(0, i + 1).join('.'));
            }, []);
            this.contexts.forEach(context =>
                events.forEach(event => context.hasOwnProperty(event) && context[event]()));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            return this.on(event, context, () => times-- > 0 ? handler.bind(context)() : null);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */

        through: function (event, context, handler, frequency) {
            return this.on(event, context,
                () => throughtStartNumber++ % frequency === 0 ? handler.bind(context)() : null);
        }
    };
}

'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

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
            if (!context || !event || !handler) {
                return this;
            }
            let contexts = this.contexts || new Set();
            context[event] = context[event] || [];
            context[event].push(handler.bind(context));
            contexts.add(context);

            return Object.assign(this, { contexts });
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            if (!context || !event) {
                return this;
            }
            Object.keys(context)
                .filter(x => (x + '.').startsWith(event + '.') && delete context[x]);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} eventToEmit
         * @returns {Object}
         */
        emit: function (eventToEmit) {
            if (!eventToEmit) {
                return this;
            }
            let splitted = eventToEmit.split('.');
            let eventsTree = splitted.reduceRight(function (tree, current, i) {
                return tree.concat(splitted.slice(0, i + 1).join('.'));
            }, []);
            this.contexts.forEach(context => eventsTree.forEach(
                event => context.hasOwnProperty(event) &&
                context[event].forEach(handler => handler.call(context)))
            );

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
            if (!context || !event || !handler) {
                return this;
            }

            return this.on(event, context, () => times-- >= 0 && handler.call(context));
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
            if (!context || !event || !handler) {
                return this;
            }
            let iterator = 1;

            return this.on(event, context, () => iterator++ % frequency && handler.call(context));
        }
    };
}

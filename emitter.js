'use strict';

/**
 * Возвращает подмножества пространства события, сортированные по убыванию количества подпространств
 * @param {String} eventNamespase
 * @returns {Array}
 */
function getNamespaces(eventNamespase) {
    let splitted = eventNamespase.split('.');

    return splitted
        .reduceRight((tree, current, i) => tree.concat(splitted.slice(0, i + 1).join('.')), []);
}

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
    let contexts = new Set();

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            context = context || this;
            context[event] = context[event] || [];
            context[event].push(handler.bind(context));
            contexts.add(context);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            Object.keys(context).filter(x => (x + '.').startsWith(event + '.') &&
                delete context[x]);

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} eventToEmit
         * @returns {Object}
         */
        emit: function (eventToEmit) {
            contexts.forEach(context => getNamespaces(eventToEmit)
                .forEach(event => context.hasOwnProperty(event) && context[event]
                    .forEach(func => func.call(context)))
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
            return this.on(event, context, () => times-- > 0 && handler.call(context));
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
            let iterator = 0;

            return this.on(event, context,
                () => iterator++ % frequency === 0 && handler.call(context));
        }
    };
}

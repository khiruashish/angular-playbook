# Reactivity

Modern Angular has two reactive primitives that work together:

| | **Signals** | **RxJS Observables** |
|---|---|---|
| Model | value that changes over time, always has a current value | stream of events over time |
| Push/pull | push notification, **pull** value (lazy, glitch-free) | push |
| Sync/async | synchronous | sync or async |
| Best for | UI state, derived state, template bindings | events, time (debounce, retry), websockets, complex async orchestration |
| Cleanup | automatic | you must unsubscribe (or use operators/pipes that do) |

**Rule:** *signals for state, RxJS for events*, and bridge them with `toSignal` / `toObservable` (`@angular/core/rxjs-interop`).

<div class="cards3d">
<a class="tilt" href="signals/"><span class="ico">⚡</span><b>Signals</b><span>signal, computed, effect, linkedSignal, resource</span></a>
<a class="tilt" href="rxjs/"><span class="ico">🌊</span><b>RxJS</b><span>operators, subjects, higher-order mapping, interop</span></a>
<a class="tilt" href="state-management/"><span class="ico">🗄️</span><b>State Management</b><span>Signal services, NgRx Store, SignalStore</span></a>
</div>

/* SpinWheelJoy reusable random-selection engine.
   No analytics, network access, or personal-data collection.
   The selection happens before animation starts. */
(function (scope) {
  'use strict';

  const UINT32_RANGE = 0x100000000;
  const MAX_CHOICES = 60;
  const MAX_LABEL_LENGTH = 72;

  function secureIndex(count, randomSource) {
    if (!Number.isSafeInteger(count) || count < 1 || count > UINT32_RANGE) {
      throw new RangeError('count must be an integer between 1 and 4294967296');
    }
    const source = randomSource || ((array) => scope.crypto.getRandomValues(array));
    const bound = Math.floor(UINT32_RANGE / count) * count;
    const buffer = new Uint32Array(1);
    let value;
    do {
      source(buffer);
      value = buffer[0];
    } while (value >= bound);
    return value % count;
  }

  function randomId() {
    if (scope.crypto && typeof scope.crypto.randomUUID === 'function') {
      return scope.crypto.randomUUID();
    }
    const buffer = new Uint8Array(12);
    scope.crypto.getRandomValues(buffer);
    return Array.from(buffer, (x) => x.toString(16).padStart(2, '0')).join('');
  }

  function entriesFromText(value, previous) {
    const parts = String(value).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (parts.length > MAX_CHOICES) throw new RangeError('Maximum 60 choices per wheel.');
    if (parts.some((label) => label.length > MAX_LABEL_LENGTH)) throw new RangeError('Keep each choice under 73 characters.');
    return parts.map((label, i) => {
      const shortened = label;
      const old = (previous || [])[i];
      return { id: old && old.label === shortened ? old.id : randomId(), label: shortened };
    });
  }

  function validateEntries(value) {
    if (!Array.isArray(value) || value.length > MAX_CHOICES) return false;
    return value.every((item) => item && typeof item.id === 'string' && item.id.length <= 90 && typeof item.label === 'string' && item.label.trim().length > 0 && item.label.length <= MAX_LABEL_LENGTH);
  }

  function availableEntries(entries, removedIds, elimination) {
    if (!elimination) return entries.slice();
    const removed = new Set(removedIds);
    return entries.filter((entry) => !removed.has(entry.id));
  }

  function selectEntry(entries, removedIds, elimination, randomSource) {
    const eligible = availableEntries(entries, removedIds, elimination);
    if (!eligible.length) return null;
    const index = secureIndex(eligible.length, randomSource);
    return { entry: eligible[index], index, eligible };
  }

  function targetRotation(currentDegrees, index, total, fullTurns) {
    if (!Number.isInteger(total) || total < 1 || index < 0 || index >= total) throw new RangeError('invalid wheel target');
    const segmentDegrees = 360 / total;
    const desired = ((-(index + 0.5) * segmentDegrees) % 360 + 360) % 360;
    const current = ((currentDegrees % 360) + 360) % 360;
    const correction = (desired - current + 360) % 360;
    const turns = Number.isInteger(fullTurns) ? Math.max(1, Math.min(10, fullTurns)) : 5;
    return currentDegrees + turns * 360 + correction;
  }

  function shuffled(source, randomSource) {
    const copy = source.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = secureIndex(i + 1, randomSource);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function distributeTeams(participants, teamCount, randomSource) {
    if (!Number.isInteger(teamCount) || teamCount < 2 || teamCount > 16) throw new RangeError('Teams must be between 2 and 16');
    if (!Array.isArray(participants) || participants.length < teamCount) throw new RangeError('Need at least one participant per team');
    const result = Array.from({ length: teamCount }, () => []);
    shuffled(participants, randomSource).forEach((person, index) => result[index % teamCount].push(person));
    return result;
  }

  function numbersBetween(min, max, step) {
    if (![min, max, step].every(Number.isSafeInteger) || step < 1 || min > max) throw new RangeError('Enter valid integer bounds and a positive step.');
    const count = Math.floor((max - min) / step) + 1;
    if (count > MAX_CHOICES) throw new RangeError('This visual wheel supports up to 60 values. Increase the step.');
    return Array.from({ length: count }, (_, i) => ({ id: randomId(), label: String(min + i * step) }));
  }

  const api = { MAX_CHOICES, MAX_LABEL_LENGTH, secureIndex, randomId, entriesFromText, validateEntries, availableEntries, selectEntry, targetRotation, shuffled, distributeTeams, numbersBetween };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  scope.SpinWheelEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);

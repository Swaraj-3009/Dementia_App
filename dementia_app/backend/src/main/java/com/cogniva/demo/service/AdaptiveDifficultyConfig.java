package com.cogniva.demo.service;

public final class AdaptiveDifficultyConfig {

    private AdaptiveDifficultyConfig() {
    }

    /*
     * All adaptive-difficulty thresholds live here.
     * Change these values in one place if the prototype
     * needs different behaviour.
     */

    public static final int RECENT_SESSION_COUNT = 5;

    public static final int MIN_SESSIONS_FOR_ADAPTATION = 2;

    public static final double HIGH_ACCURACY_PERCENT = 80.0;

    public static final double LOW_ACCURACY_PERCENT = 50.0;

    /*
     * Response time is normalized per answer so games with
     * different numbers of rounds can still be compared.
     */
    public static final long FAST_RESPONSE_PER_ANSWER_MS = 2500L;

    /*
     * Number of consecutive low-performing sessions that
     * counts as repeated failure.
     */
    public static final int REPEATED_FAILURE_SESSIONS = 2;
}

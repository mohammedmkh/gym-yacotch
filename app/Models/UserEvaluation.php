<?php

namespace App;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property integer $evaluated_user_id
 * @property integer $evaluator_user_id
 * @property string $evaluation_no
 * @property string $evaluation_text
 * @property string $type
 * @property string $created_at
 * @property string $updated_at
 * @property string $deleted_at
 * @property User $evaluated_user
 * @property User $evaluator_user
 */
class UserEvaluation extends Model
{
    /**
     * The "type" of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'integer';

    /**
     * @var array
     */
    protected $fillable = ['evaluated_user_id', 'evaluator_user_id', 'evaluation_no', 'evaluation_text', 'type', 'created_at', 'updated_at', 'deleted_at'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function evaluated_user()
    {
        return $this->belongsTo(User::class, 'evaluated_user_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function evaluator_user()
    {
        return $this->belongsTo(User::class, 'evaluator_user_id');
    }
}

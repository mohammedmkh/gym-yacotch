<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property string $name
 * @property string $price
 * @property int $long_months
 * @property string $created_at
 * @property string $updated_at
 * @property string $deleted_at
 * @property CaptinQuote[] $captinQuotes
 * @property QuotePlan[] $quotePlans
 */
class Quote extends Model
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
    protected $fillable = ['name', 'price', 'long_months', 'created_at', 'updated_at', 'deleted_at'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function captinQuotes()
    {
        return $this->hasMany('App\CaptinQuote');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function quotePlans()
    {
        return $this->hasMany('App\QuotePlan');
    }
}

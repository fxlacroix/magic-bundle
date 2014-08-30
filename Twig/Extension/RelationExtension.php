<?php

namespace FXL\Bundle\MagicBundle\Twig\Extension;

use Symfony\Component\HttpKernel\KernelInterface;
use Twig_Extension;
use Twig_Filter_Method;
use FXL\Component\Command\BaseCommand;
use Doctrine\ORM\EntityManager;


class RelationExtension extends \Twig_Extension
{
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    public function getFilters()
    {
        return array(
            'getOwningSideRelations' => new Twig_Filter_Method($this, 'getOwningSideRelations'),
            'debugGetRelation' => new Twig_Filter_Method($this, 'debugGetRelation'),
            'stop' => new Twig_Filter_Method($this, 'stop'),
            'dump' => new Twig_Filter_Method($this, 'dump'),
            'getClass' => new Twig_Filter_Method($this, 'getClass'),
            'getClassChildName' => new Twig_Filter_Method($this, 'getClassChildName'),
            'getClassCss' => new Twig_Filter_Method($this, 'getClassCss'),
            'getNamespaceChildName' => new Twig_Filter_Method($this, 'getNamespaceChildName'),
            'shuffle' => new Twig_Filter_Method($this, 'shuffle'),
        );
    }

    public function shuffle($data)
    {

        $data = (array)$data;

        shuffle($data);

        return $data;

    }

    public function stop($data)
    {

        die("too much recursive");
    }


    public function getClassCss($object)
    {

        return str_replace(array("bundle-", "entity-"), array("", "-"), strtolower(str_replace("\\", "-", get_class($object))));
    }

    public function getClassChildName($object)
    {

        $class = $this->getClass($object);

        $all = explode('\\', $class);

        return strtolower(end($all));

    }


    public function getNamespaceChildName($string)
    {

        $all = explode('\\', $string);

        return strtolower(end($all));
    }

    public function getClass($object)
    {

        if (!$object) {

            return null;
        }

        if ($object instanceof \Doctrine\ORM\PersistentCollection) {

            $first = $object->first();

            if (!is_object($first)) {
                return null;
            }

            $class = get_class($first);

        } else {

            $class = get_class($object);
        }

        return $class;
    }

    public function getOwningSideRelations($object)
    {
        $class = $this->getClass($object);

        $associationMappings = $this->em->getClassMetadata($class)->associationMappings;

        foreach ($associationMappings as $key => $associationMapping) {

            if ($associationMapping['isOwningSide']) {

                unset($associationMappings[$key]);
            }
        }

        return $associationMappings;
    }

    public function dump($dump)
    {

        \Doctrine\Common\Util\Debug::dump($dump);
    }

    public function debugGetRelation($object)
    {
        $class = $this->getClass($object);

        $associationMappings = $this->em->getClassMetadata($class)->associationMappings;

        \Doctrine\Common\Util\Debug::dump($associationMappings);
    }

    public function getName()
    {
        return 'twig.extension.qcm';
    }
}